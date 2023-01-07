from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import User, Comment
from captcha.fields import ReCaptchaField
from captcha.widgets import ReCaptchaV2Checkbox


class CommentForm(forms.ModelForm):
    """ Форма комментарий """
    
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox())
    
    class Meta:
        model = Comment
        fields = ('text',)
        widgets = {
            'text': forms.TextInput(attrs={'class': 'field-comment-input', 'id': 'add-comment', 'placeholder': 'Оставить комментарий'}),
        }


class LoginUserForm(AuthenticationForm, forms.ModelForm):
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox())
    
    class Meta:
        model = User
        fields = ('username', 'password')
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = 'field-str-input register-input'
            self.fields[field].help_text = None
            self.fields['username'].widget.attrs['placeholder'] = 'Имя'
            self.fields['password'].widget.attrs['placeholder'] = 'Пароль'


class RegisterUserForm(forms.ModelForm):
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox())
    
    class Meta:
        model = User
        fields = ('username', 'password')
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Имя'}),
            'password': forms.PasswordInput(attrs={'placeholder': 'Пароль'})
        }
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = 'field-str-input register-input'
            self.fields[field].help_text = None
            
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user
    