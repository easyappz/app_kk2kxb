from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from api.models import Member, Post, Comment, Like, Repost, FriendRequest, Subscription
from api.serializers import (
    MemberSerializer,
    MemberRegistrationSerializer,
    LoginSerializer,
    TokenSerializer,
    OnlineStatusSerializer,
    PostSerializer,
    CommentSerializer
)
from api.authentication import MemberJWTAuthentication


class RegisterView(APIView):
    """
    Register a new member
    """
    permission_classes = [AllowAny]

    @extend_schema(
        request=MemberRegistrationSerializer,
        responses={201: MemberSerializer},
        description="Register a new member with username, email and password"
    )
    def post(self, request):
        serializer = MemberRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            member_data = MemberSerializer(member).data
            return Response(member_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Login and receive JWT tokens
    """
    permission_classes = [AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: TokenSerializer},
        description="Login with username and password to receive JWT access and refresh tokens"
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not member.check_password(password):
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Update last_seen and is_online
        member.last_seen = timezone.now()
        member.is_online = True
        member.save()

        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = member.id

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })


class LogoutView(APIView):
    """
    Logout and set user offline
    """
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: dict},
        description="Logout and set user status to offline"
    )
    def post(self, request):
        member = request.user
        member.is_online = False
        member.last_seen = timezone.now()
        member.save()

        return Response({"detail": "Successfully logged out"}, status=status.HTTP_200_OK)


class MemberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Member operations
    """
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'first_name', 'last_name', 'email']
    ordering_fields = ['date_joined', 'username']
    ordering = ['-date_joined']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    @extend_schema(
        responses={200: MemberSerializer(many=True)},
        description="List all members with pagination"
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        responses={200: MemberSerializer},
        description="Get member profile by ID"
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        request=MemberSerializer,
        responses={200: MemberSerializer},
        description="Update member profile (only own profile)"
    )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id != request.user.id:
            return Response(
                {"detail": "You can only update your own profile"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    @extend_schema(
        request=MemberSerializer,
        responses={200: MemberSerializer},
        description="Partially update member profile (only own profile)"
    )
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id != request.user.id:
            return Response(
                {"detail": "You can only update your own profile"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='q',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Search query for username, first_name, or last_name',
                required=True
            )
        ],
        responses={200: MemberSerializer(many=True)},
        description="Search members by username, first name or last name"
    )
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {"detail": "Search query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        members = Member.objects.filter(
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query)
        )

        page = self.paginate_queryset(members)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(members, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=OnlineStatusSerializer,
        responses={200: MemberSerializer},
        description="Update member online status"
    )
    @action(detail=True, methods=['patch'], url_path='online-status')
    def online_status(self, request, pk=None):
        member = self.get_object()
        if member.id != request.user.id:
            return Response(
                {"detail": "You can only update your own online status"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OnlineStatusSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        member.is_online = serializer.validated_data['is_online']
        member.last_seen = timezone.now()
        member.save()

        return Response(MemberSerializer(member).data)


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Post operations
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Post.objects.all()
        author_id = self.request.query_params.get('author')
        
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        elif self.action == 'list':
            # News feed: posts from friends and subscriptions
            user = self.request.user
            
            # Get friends
            friend_requests = FriendRequest.objects.filter(
                Q(from_member=user) | Q(to_member=user),
                status='accepted'
            )
            friend_ids = set()
            for fr in friend_requests:
                if fr.from_member.id == user.id:
                    friend_ids.add(fr.to_member.id)
                else:
                    friend_ids.add(fr.from_member.id)
            
            # Get subscriptions
            subscriptions = Subscription.objects.filter(follower=user)
            subscription_ids = set(sub.following.id for sub in subscriptions)
            
            # Combine with own posts
            all_ids = friend_ids | subscription_ids | {user.id}
            queryset = queryset.filter(author_id__in=all_ids)
        
        return queryset.order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @extend_schema(
        responses={200: PostSerializer(many=True)},
        description="Get news feed (posts from friends and subscriptions)"
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        responses={200: PostSerializer},
        description="Get post by ID"
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        request=PostSerializer,
        responses={201: PostSerializer},
        description="Create new post"
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=PostSerializer,
        responses={200: PostSerializer},
        description="Update post (author only)"
    )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author.id != request.user.id:
            return Response(
                {"detail": "You can only update your own posts"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    @extend_schema(
        request=PostSerializer,
        responses={200: PostSerializer},
        description="Partially update post (author only)"
    )
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author.id != request.user.id:
            return Response(
                {"detail": "You can only update your own posts"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        responses={204: None},
        description="Delete post (author only)"
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author.id != request.user.id:
            return Response(
                {"detail": "You can only delete your own posts"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        responses={200: dict},
        description="Add like to post"
    )
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        
        like, created = Like.objects.get_or_create(member=user, post=post)
        
        if not created:
            return Response(
                {"detail": "You already liked this post"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        likes_count = Like.objects.filter(post=post).count()
        return Response({"likes_count": likes_count}, status=status.HTTP_200_OK)

    @extend_schema(
        responses={200: dict},
        description="Remove like from post"
    )
    @action(detail=True, methods=['delete'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        
        try:
            like = Like.objects.get(member=user, post=post)
            like.delete()
            likes_count = Like.objects.filter(post=post).count()
            return Response({"likes_count": likes_count}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            return Response(
                {"detail": "You have not liked this post"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @extend_schema(
        responses={200: MemberSerializer(many=True)},
        description="Get list of users who liked the post"
    )
    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        post = self.get_object()
        likes = Like.objects.filter(post=post).select_related('member')
        members = [like.member for like in likes]
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)

    @extend_schema(
        responses={200: CommentSerializer(many=True)},
        description="Get comments for post"
    )
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_object()
        comments = Comment.objects.filter(post=post).select_related('author').order_by('-created_at')
        
        page = self.paginate_queryset(comments)
        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=CommentSerializer,
        responses={201: CommentSerializer},
        description="Add comment to post"
    )
    @action(detail=True, methods=['post'])
    def comments(self, request, pk=None):
        post = self.get_object()
        
        content = request.data.get('content')
        if not content:
            return Response(
                {"detail": "Content is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        comment = Comment.objects.create(
            author=request.user,
            post=post,
            content=content
        )
        
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        responses={201: PostSerializer},
        description="Repost a post"
    )
    @action(detail=True, methods=['post'])
    def repost(self, request, pk=None):
        original_post = self.get_object()
        user = request.user
        
        # Check if already reposted
        existing_repost = Repost.objects.filter(member=user, post=original_post).first()
        if existing_repost:
            return Response(
                {"detail": "You already reposted this post"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create repost record
        repost = Repost.objects.create(member=user, post=original_post)
        
        # Create new post as repost
        new_post = Post.objects.create(
            author=user,
            content=request.data.get('content', ''),
            image_url=original_post.image_url,
            video_url=original_post.video_url
        )
        
        serializer = PostSerializer(new_post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Comment operations
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['delete']

    @extend_schema(
        responses={204: None},
        description="Delete comment (author only)"
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author.id != request.user.id:
            return Response(
                {"detail": "You can only delete your own comments"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
