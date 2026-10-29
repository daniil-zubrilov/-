from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import Workout, Exercise, Set


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2")

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password2": "Пароли не совпадают"})
        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError({"username": "Логин занят"})
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({"email": "Email уже используется"})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        return User.objects.create_user(**validated_data)


class SetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    weight = serializers.FloatField()  # <-- ДОБАВИЛИ ЭТО
    reps = serializers.IntegerField()  # <-- И ЭТО

    class Meta:
        model = Set
        fields = ("id", "weight", "reps", "order")


class ExerciseSerializer(serializers.ModelSerializer):
    sets = SetSerializer(many=True, required=False)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Exercise
        fields = ("id", "name", "order", "sets")


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, required=False)

    class Meta:
        model = Workout
        fields = ("id", "title", "date", "notes", "created_at", "exercises")
        read_only_fields = ("created_at",)

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Название обязательно")
        return value

    @transaction.atomic
    def create(self, validated_data):
        exercises_data = validated_data.pop("exercises", [])
        workout = Workout.objects.create(**validated_data)
        
        for ex_data in exercises_data:
            sets_data = ex_data.pop("sets", [])
            ex_data.pop("id", None)
            exercise = Exercise.objects.create(workout=workout, **ex_data)
            
            for set_data in sets_data:
                set_data.pop("id", None)
                Set.objects.create(exercise=exercise, **set_data)
                
        return workout

    @transaction.atomic
    def update(self, instance, validated_data):
        exercises_data = validated_data.pop("exercises", None)
        
        instance.title = validated_data.get("title", instance.title)
        instance.date = validated_data.get("date", instance.date)
        instance.notes = validated_data.get("notes", instance.notes)
        instance.save()

        if exercises_data is not None:
            instance.exercises.all().delete()
            
            for ex_data in exercises_data:
                sets_data = ex_data.pop("sets", [])
                ex_data.pop("id", None)
                exercise = Exercise.objects.create(workout=instance, **ex_data)
                
                for set_data in sets_data:
                    set_data.pop("id", None)
                    Set.objects.create(exercise=exercise, **set_data)
                    
        return instance