from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    RegisterView,
    LoginView,
    LogoutView,
    MemberViewSet,
    PostViewSet,
    CommentViewSet
)

router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='member')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]
