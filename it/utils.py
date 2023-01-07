from .models import User
from .services import get_user_by_ip

class DataMixin:
    def get_user_data(self, **kwargs):
        context = kwargs
        user = self.request.user
        
        if not user.is_authenticated:
            user = get_user_by_ip(self.request)
            
        context['user'] = user
        
        return context