from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions
from api.models import Member


class MemberJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that uses Member model instead of User
    """

    def get_user(self, validated_token):
        try:
            user_id = validated_token.get('user_id')
            if user_id is None:
                raise exceptions.AuthenticationFailed('Token contained no recognizable user identification')
            
            member = Member.objects.get(id=user_id)
            return member
        except Member.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found')
