from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone


class Member(models.Model):
    username = models.CharField(max_length=150, unique=True, db_index=True)
    password = models.CharField(max_length=128)
    email = models.EmailField()
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    avatar_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    date_joined = models.DateTimeField(default=timezone.now, db_index=True)
    last_seen = models.DateTimeField(default=timezone.now)
    is_online = models.BooleanField(default=False)

    is_authenticated = True
    is_anonymous = False

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    def __str__(self):
        return self.username

    class Meta:
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['-date_joined']),
        ]


class Post(models.Model):
    author = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post by {self.author.username} at {self.created_at}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['author', '-created_at']),
        ]


class Like(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    def __str__(self):
        return f"{self.member.username} liked post {self.post.id}"

    class Meta:
        unique_together = ('member', 'post')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', '-created_at']),
        ]


class Comment(models.Model):
    author = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    def __str__(self):
        return f"Comment by {self.author.username} on post {self.post.id}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', '-created_at']),
        ]


class Repost(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='reposts')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reposts')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    def __str__(self):
        return f"{self.member.username} reposted post {self.post.id}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['member', '-created_at']),
        ]


class FriendRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    from_member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='sent_requests')
    to_member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    def __str__(self):
        return f"Friend request from {self.from_member.username} to {self.to_member.username} ({self.status})"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['to_member', 'status', '-created_at']),
            models.Index(fields=['from_member', '-created_at']),
        ]


class Subscription(models.Model):
    follower = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"

    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['follower', '-created_at']),
            models.Index(fields=['following', '-created_at']),
        ]


class Message(models.Model):
    sender = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    is_read = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['receiver', 'is_read', '-created_at']),
            models.Index(fields=['sender', '-created_at']),
        ]
