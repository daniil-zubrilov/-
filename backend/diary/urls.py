from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, WorkoutViewSet, ThrottledTokenObtainPairView
from .export import ExportExcelView # <--- ДОБАВИТЬ

router = DefaultRouter()
router.register(r"workouts", WorkoutViewSet, basename="workout")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/token/", ThrottledTokenObtainPairView.as_view()),
    path("auth/token/refresh/", TokenRefreshView.as_view()),
    path("export/", ExportExcelView.as_view()), # <--- ДОБАВИТЬ
    path("", include(router.urls)),
]