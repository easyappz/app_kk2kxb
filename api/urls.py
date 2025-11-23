from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    RegisterView,
    LoginView,
    LogoutView,
    MemberViewSet,
    PostViewSet,
    CommentViewSet,
    FriendRequestViewSet,
    FriendViewSet,
    SubscriptionViewSet
)

router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='member')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    
    # Friend requests
    path('friends/request/', FriendRequestViewSet.as_view({'post': 'create'}), name='friend-request-create'),
    path('friends/requests/', FriendRequestViewSet.as_view({'get': 'list'}), name='friend-request-list'),
    path('friends/requests/<int:pk>/accept/', FriendRequestViewSet.as_view({'post': 'accept'}), name='friend-request-accept'),
    path('friends/requests/<int:pk>/reject/', FriendRequestViewSet.as_view({'post': 'reject'}), name='friend-request-reject'),
    
    # Friends
    path('friends/', FriendViewSet.as_view({'get': 'list'}), name='friend-list'),
    path('friends/<int:pk>/', FriendViewSet.as_view({'delete': 'destroy'}), name='friend-remove'),
    
    # Subscriptions
    path('subscriptions/<int:pk>/', SubscriptionViewSet.as_view({'post': 'create', 'delete': 'destroy'}), name='subscription'),
    path('subscriptions/following/', SubscriptionViewSet.as_view({'get': 'following'}), name='subscription-following'),
    path('subscriptions/followers/', SubscriptionViewSet.as_view({'get': 'followers'}), name='subscription-followers'),
    
    path('', include(router.urls)),
]
