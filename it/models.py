from django.db import models
from django.urls import reverse
import re
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """ Пользователь """
    
    def upload_user_icon(instance, filename):
        folder = re.sub("[^A-Za-z]", "_", instance.username)[:20]

        return f"user/{folder}/{filename}"
    
    username    = models.CharField('Имя пользователя', max_length=255, unique=True, null=True)
    icon        = models.ImageField('Иконка', upload_to=upload_user_icon)
    ip          = models.CharField('Ip пользователя', max_length=255, editable=False, unique=True, null=True)
    added_on    = models.DateTimeField('Дата регистрации', auto_now_add=True)
    favorites   = models.ManyToManyField('Video', verbose_name='Сохраненные видео', db_index=True, related_name='user_favorites')
    subscribers = models.ManyToManyField('Channel', verbose_name='Подписки', db_index=True, related_name='user_subscribers')

    def __str__(self):
        return self.username


class Channel(models.Model):
    """ Каналы """
    
    def upload_to_icon(instance, filename):
        channel = instance.slug
    
        return f"channels/{channel}/channel/{filename}"
    
    title               = models.CharField('Название', max_length=255)
    bio                 = models.TextField('Описание', null=True, blank=True)
    cap                 = models.ImageField('Шапка', upload_to=upload_to_icon, null=True, blank=True)
    icon                = models.ImageField('Иконка', upload_to=upload_to_icon)
    subscribers         = models.ManyToManyField(User, verbose_name='Подписчики', editable=False, related_name='channel_subscribers')
    added_on            = models.DateTimeField('Дата создания', auto_now_add=True)
    is_published        = models.BooleanField('Опубликованно', default=True)
    fake_subscribers    = models.PositiveIntegerField('тест подписчики', default=0)
    slug                = models.SlugField('Slug', max_length=255, unique=True)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("channel_detail", kwargs={"slug": self.slug})


    class Meta:
        verbose_name = 'Канал'
        verbose_name_plural = 'Каналы'
        ordering = ['title']
        

class Category(models.Model):
    """ Категории к видео """
    
    def upload_category(instance, filename):
        folder = instance.slug

        return f"category/{folder}/{filename}"
    
    title           = models.CharField('Название', max_length=255)
    description     = models.TextField('Описание', help_text='Не более 156 символов', blank=True)
    image           = models.ImageField('Изображение', upload_to=upload_category, blank=True)
    index           = models.PositiveSmallIntegerField('Индекс', default=3000)
    slug            = models.SlugField('Slug', max_length=255, blank=True)
    is_published    = models.BooleanField('Опубликованно', default=True)
    
    
    def __str__(self):
        return self.title
    
    
    def get_absolute_url(self):
        return reverse("category_video", kwargs={"slug": self.slug})
    
    
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['title']
        

class Tag(models.Model):
    """ Теги к видео """

    title = models.CharField('Тег', max_length=255, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        ordering = ['title']


class Video(models.Model):
    """ видео """
    
    def content_file_name(instance, filename):
        folder = instance.slug
        channel = instance.channel.slug
        return f"channels/{channel}/videos/{folder}/{filename}"

    title           = models.CharField('Название', max_length=255)
    description     = models.TextField('Описание', help_text='Не более 156 символов', blank=True)
    video480p       = models.FileField('Видео 480p', upload_to=content_file_name, null=True, blank=True)
    video720p       = models.FileField('Видео 720p', upload_to=content_file_name)
    video1080p      = models.FileField('Видео 1080p', upload_to=content_file_name, null=True, blank=True)
    poster          = models.ImageField('Постер', upload_to=content_file_name)
    thumbnail       = models.ImageField('Миниатюра full', upload_to=content_file_name)
    thumb_short     = models.ImageField('Миниатюра short', upload_to=content_file_name)
    duration        = models.CharField('Продолжительность', max_length=255)
    tags            = models.ManyToManyField(Tag, verbose_name='Теги', db_index=True, related_name='video_tags')
    channel         = models.ForeignKey(Channel, verbose_name='Канал', on_delete=models.CASCADE, db_index=True)
    category        = models.ManyToManyField(Category, db_index=True, verbose_name='Категория к видео', related_name='categories_by_video')
    views           = models.ManyToManyField(User, verbose_name='Просмотры', editable=False, related_name='video_views')
    likes           = models.ManyToManyField(User, verbose_name='Лайки', editable=False, related_name='video_likes')
    fake_views      = models.PositiveIntegerField('тест просмотры', default=0)
    fake_likes      = models.PositiveIntegerField('тест лайки', default=0)
    fake_dislikes   = models.PositiveIntegerField('тест дизлайки', default=0)
    fake_favorites  = models.PositiveIntegerField('добавленны', default=0)
    dislikes        = models.ManyToManyField(User, verbose_name='Дизлайки', editable=False, related_name='video_dislikes')
    is_published    = models.BooleanField('Опубликованно', default=True)
    added_on        = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_on      = models.DateTimeField('Дата редактирования', auto_now=True)
    slug            = models.SlugField('Slug', max_length=255, unique=True)

    def __str__(self):
        return self.title
    
    def get_comment(self):
        return self.comment_set.filter(review__isnull=True)
    
    def get_absolute_url(self):
        return reverse("video_detail", kwargs={"slug": self.slug})
    

    class Meta:
        verbose_name = 'видео'
        verbose_name_plural = 'видео'
        ordering = ['-pk']


class Comment(models.Model):
    """ Комментарии """
    
    user        = models.ForeignKey(User, verbose_name='Пользователь', db_index=True, on_delete=models.CASCADE)
    text        = models.TextField('Текст комментария', max_length=5000)
    likes       = models.ManyToManyField(User, verbose_name='Пользователи нажали на лайк', db_index=True, related_name='comment_likes')
    added_on    = models.DateTimeField('Дата создания', auto_now_add=True)
    review      = models.ForeignKey('self', verbose_name='Ответы на коммент', db_index=True, on_delete=models.SET_NULL, blank=True, null=True)
    video       = models.ForeignKey(Video, verbose_name='Видео', db_index=True, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.user}'
    
    def get_comments_likes(self):
        return self.likes.count()
    
    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-pk']