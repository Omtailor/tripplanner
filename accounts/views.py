from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserProfileSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]  # No auth needed to register

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "Account created successfully",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserProfileSerializer(user).data,
                },
                status=201,
            )
        return Response(serializer.errors, status=400)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Must be logged in

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
