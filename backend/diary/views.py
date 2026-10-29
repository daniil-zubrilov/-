from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from .models import Workout
from .serializers import RegisterSerializer, WorkoutSerializer
from .permissions import IsOwner
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .throttles import LoginRateThrottle


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Workout.objects.filter(owner=self.request.user).prefetch_related("exercises__sets")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ThrottledTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        # Проверяем лимит ДО попытки логина
        throttle = LoginRateThrottle()
        if not throttle.allow_request(request, self):
            return Response(
                {'detail': 'Слишком много попыток входа. Попробуйте через минуту.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        # Пытаемся залогиниться
        response = super().post(request, *args, **kwargs)

        # Если логин НЕУДАЧНЫЙ — записываем попытку в кэш
        if response.status_code != 200:
            ident = throttle.get_ident(request)
            key = throttle.cache_format % {'scope': 'login_fail', 'ident': ident}
            fails = cache.get(key, 0) + 1
            cache.set(key, fails, timeout=60)  # окно 1 минута

            if fails >= 10:
                return Response(
                    {'detail': 'Слишком много неудачных попыток. IP заблокирован на 1 минуту.'},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        return response