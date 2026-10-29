from rest_framework.throttling import SimpleRateThrottle
from django.core.cache import cache

class LoginRateThrottle(SimpleRateThrottle):
    scope = 'login'
    rate = '10/min'

    def get_cache_key(self, request, view):
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request)
        }

    def allow_request(self, request, view):
        # Сначала проверяем лимит
        if not super().allow_request(request, view):
            return False
        return True

    def throttle_failure(self):
        # Вызывается когда лимит превышен
        pass