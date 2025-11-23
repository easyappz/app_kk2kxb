from rest_framework import serializers
from django.db import models
from api.models import Member, Post, Comment, Like, FriendRequest, Subscription, Message


class MemberSerializer(serializers.ModelSerializer):
    friends_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'avatar_url',
            'bio',
            'date_joined',
            'last_seen',
            'is_online',
            'friends_count',
            'followers_count',
            'following_count'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_friends_count(self, obj):
        return FriendRequest.objects.filter(
            status='accepted'
        ).filter(
            models.Q(from_member=obj) | models.Q(to_member=obj)
        ).count()

    def get_followers_count(self, obj):
        return Subscription.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return Subscription.objects.filter(follower=obj).count()


class MemberRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)
    password_confirm = serializers.CharField(write_only=True, min_length=8, max_length=128, required=False)

    class Meta:
        model = Member
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name'
        ]

    def validate_username(self, value):
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if Member.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate(self, data):
        password_confirm = data.get('password_confirm')
        if password_confirm and data['password'] != password_confirm:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        member = Member(**validated_data)
        member.set_password(password)
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


class TokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class OnlineStatusSerializer(serializers.Serializer):
    is_online = serializers.BooleanField()


class CommentSerializer(serializers.ModelSerializer):
    author = MemberSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'post', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    author = MemberSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    reposts_count = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'author',
            'content',
            'image_url',
            'video_url',
            'created_at',
            'updated_at',
            'likes_count',
            'comments_count',
            'reposts_count',
            'is_liked_by_user'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return Like.objects.filter(post=obj).count()

    def get_comments_count(self, obj):
        return Comment.objects.filter(post=obj).count()

    def get_reposts_count(self, obj):
        from api.models import Repost
        return Repost.objects.filter(post=obj).count()

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and isinstance(request.user, Member):
            return Like.objects.filter(post=obj, member=request.user).exists()
        return False


class FriendRequestSerializer(serializers.ModelSerializer):
    from_member = MemberSerializer(read_only=True)
    to_member = MemberSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_member', 'to_member', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    follower = MemberSerializer(read_only=True)
    following = MemberSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['id', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender = MemberSerializer(read_only=True)
    receiver = MemberSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'created_at', 'is_read']
        read_only_fields = ['id', 'created_at']
