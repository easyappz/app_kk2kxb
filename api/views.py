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

from api.models import Member
from api.serializers import (
    MemberSerializer,
    MemberRegistrationSerializer,
    LoginSerializer,
    TokenSerializer,
    OnlineStatusSerializer
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
