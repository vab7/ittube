from django.contrib import admin
from .models import *
from django.utils.safestring import mark_safe

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'image', 'slug', 'index', 'is_published')
    list_editable = ('title', 'image', 'index', 'slug', 'is_published')
    search_fields = ('title',)

@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug', 'get_icon', 'is_published')
    list_display_links = ('id', 'title')
    list_editable = ('is_published',)
    search_fields = ('title', 'bio', 'slug')
    
    def get_icon(self, obj):
        if obj.icon:
            return mark_safe(f'<img src="{obj.icon.url}" height="35" />')
        else:
            return ''

    get_icon.short_description = 'Иконка'
    

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    search_fields = ('title',)
    list_editable = ('title',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'ip', 'added_on')
    search_fields = ('username',)
    
    
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'text', 'review', 'video')
    search_fields = ('text',)

    
    
@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'channel', 'get_poster', 'slug', 'added_on', 'is_published')
    list_display_links = ('id', 'title')
    list_filter = ('is_published',)
    list_editable = ('is_published',)
    search_fields = ('title', 'slug')
    
    def get_poster(self, obj):
        return mark_safe(f'<img src="{obj.poster.url}" height="35" />')
    
    get_poster.short_description = 'Постер'
    