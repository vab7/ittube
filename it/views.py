from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login
from django.views.generic import ListView, CreateView, View
from .models import Video, Channel, Category, User, Comment
from django.contrib.auth.views import LoginView, LogoutView
from .forms import LoginUserForm, RegisterUserForm
from django.http import StreamingHttpResponse
from .services import open_file
import random
from .forms import CommentForm
from django.http import JsonResponse
from django.db.models import Q
from .utils import DataMixin
from django.conf import settings
import requests
from django.http import HttpResponse
from django.views.decorators.http import require_GET
import os


tag_title = ' • ITtube'
meta_description = ''
meta_keywords = ''


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_id(request):
    ip = get_client_ip(request)

    user = User.objects.filter(ip=ip)

    if not user.exists():
        randomNum = random.randint(100000000, 999999999)
        user = User.objects.create_user(username=f'Гость ID {randomNum}', ip=ip)

        return user

    return user[0]


def get_user_subscribers_count(user):
    subscribers_count = user.subscribers.count()

    return subscribers_count


def get_videos_suggestions(pk):
        videos_suggestions = Video.objects.filter(~Q(pk=pk), is_published=True)
        return videos_suggestions


class HomePage(ListView):
    """ Главная страница """

    model = Video
    template_name = 'pages/home_page.html'
    title = 'ITtube - главная страница'
    paginate_by = 16

    def get_queryset(self):
        videos = super().get_queryset()
        return videos.filter(is_published=True).order_by('?')

    def get_context_data(self, **kwargs):
        user = self.request.user

        if not user.is_authenticated:
            user = get_user_id(self.request)

        context = super().get_context_data(**kwargs)
        context['title'] = self.title
        context['meta_description'] = meta_description
        context['meta_keywords'] = meta_keywords
        context['h1'] = ''
        context['user_id'] = user.username
        context['user_subscribers'] = get_user_subscribers_count(user)

        return context


class CategoryVideo(DataMixin, ListView):
    """ Список категорий видео """

    model = Video
    template_name = 'pages/category_video_page.html'
    context_object_name = 'video_list'
    paginate_by = 16

    def get_queryset(self):
        videos = Video.objects.filter(
        category__slug=self.kwargs['slug'], is_published=True)
        return videos

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        category = Category.objects.get(slug=self.kwargs['slug'])
        user = self.get_user_data()['user']

        title = str(category).title()

        context["h1"] = f'{title}'
        context['title'] = f'{title} {tag_title}'
        context['meta_description'] = category.description
        context['user_id'] = user
        context['user_subscribers'] = user.subscribers.count()
        context['meta_description'] = meta_description
        context['meta_keywords'] = meta_keywords

        return context


def get_subscribe_status(user, channel):
    subscribe_status = False

    if channel.subscribers.filter(pk=user.pk).exists():
            subscribe_status = True

    return subscribe_status


def get_video_by_slug(slug):
    return Video.objects.get(slug=slug)


def user_view_video(user, video):
    user_view = video.views.filter(pk=user.pk).exists()

    if not user_view:
        video.views.add(user)

    return True


def get_like_status(user, video):
    like_status = False

    if video.likes.filter(pk=user.pk).exists():
        like_status = True

    return like_status

def get_dislike_status(user, video):
    dislike_status = False

    if video.dislikes.filter(pk=user.pk).exists():
        dislike_status = True

    return dislike_status

def get_favorite_status(user, video):
    favorite_status = False

    if user.favorites.filter(pk=video.pk).exists():
        favorite_status = True

    return favorite_status


class VideoDetail(ListView):
    """ Видео """

    model = Video
    template_name = 'pages/video.html'
    paginate_by = 16

    def get_queryset(self):
        videos = super().get_queryset()

        video = videos.get(slug=self.kwargs['slug'])

        filter_videos = videos.filter(~Q(pk=video.pk), is_published=True).order_by('?')

        return filter_videos

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        video = get_video_by_slug(self.kwargs['slug'])
        channel = video.channel
        user = self.request.user

        if not user.is_authenticated:
            ip = get_client_ip(self.request)
            user = User.objects.get(ip=ip)

        user_view_video(user, video)

        context['video'] = video
        context['like_status'] = get_like_status(user, video)
        context['dislike_status'] = get_dislike_status(user, video)
        context['favorite_status'] = get_favorite_status(user, video)
        context['subscribe_status'] = get_subscribe_status(user, channel)
        context['user_id'] = user
        context['user_subscribers'] = user.subscribers.count()
        context['site_key'] = settings.RECAPTCHA_PUBLIC_KEY
        context['title'] = video.title + tag_title
        context['form'] = CommentForm
        context['meta_description'] = meta_description
        context['meta_keywords'] = meta_keywords

        return context

def add_video_like(request):
    post = request.POST
    user = request.user

    if not user.is_authenticated:
        ip = get_client_ip(request)
        user = User.objects.get(ip=ip)

    video = Video.objects.get(pk=post['video_id'])

    if not video.likes.filter(pk=user.pk).exists():
        video.likes.add(user)
    else:
        video.likes.remove(user)

    return JsonResponse({'status': 200})

def add_video_dislike(request):
    post = request.POST
    user = request.user

    if not user.is_authenticated:
        ip = get_client_ip(request)
        user = User.objects.get(ip=ip)

    video = Video.objects.get(pk=post['video_id'])

    if not video.dislikes.filter(pk=user.pk).exists():
        video.dislikes.add(user)
    else:
        video.dislikes.remove(user)

    return JsonResponse({'status': 200})


def add_video_favorite(request):
    post = request.POST
    user = request.user

    if not user.is_authenticated:
        ip = get_client_ip(request)
        user = User.objects.get(ip=ip)

    video = Video.objects.get(pk=post['video_id'])

    if not user.favorites.filter(pk=video.pk).exists():
        user.favorites.add(video)
    else:
        user.favorites.remove(video)

    return JsonResponse({'status': 200})


def subscribe_user_channel(request):
    post = request.POST
    user = request.user

    if not user.is_authenticated:
        ip = get_client_ip(request)
        user = User.objects.get(ip=ip)

    channel = Channel.objects.get(pk=post['channel_pk'])

    if not channel.subscribers.filter(pk=user.pk).exists():
        channel.subscribers.add(user)
        user.subscribers.add(channel)
    else:
        channel.subscribers.remove(user)
        user.subscribers.remove(channel)

    return JsonResponse({'status': 200})


def get_streaming_video(request, pk: int, size):
    file, status_code, content_length, content_range = open_file(request, pk, size)
    response = StreamingHttpResponse(file, status=status_code, content_type='video/mp4')

    response['Accept-Ranges'] = 'bytes'
    response['Content-Length'] = str(content_length)
    response['Cache-Control'] = 'no-cache'
    response['Content-Range'] = content_range
    return response


class LoginUser(LoginView):
    """ Вход пользователя """

    form_class = LoginUserForm
    template_name = 'pages/login_user.html'
    success_url = reverse_lazy('home_page')

    def get_success_url(self):
        return self.success_url


class RegisterUser(DataMixin, CreateView):
    """ Регистрация пользователя """

    model = User
    form_class = RegisterUserForm
    template_name = 'pages/register_user.html'
    success_url = reverse_lazy('home_page')

    def form_valid(self, form):
        form_valid = super().form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        auth_user = authenticate(username=username, password=password)
        login(self.request, auth_user)
        return form_valid

    def get_context_data(self, **kwargs):
        context = super().get_context_data()

        user = self.get_user_data()

        context['user_id'] = user['user']
        context['user_subscribers'] = get_user_subscribers_count(user['user'])

        return context


class LogoutUser(LogoutView):
    """ Выход пользователя из аккаунта """

    next_page = 'home_page'


def get_user_subsribers_pk(user):
    subscribers = []

    for channel in user.subscribers.all():
        subscribers.append(channel.pk)

    return subscribers

class ChannelsListPage(ListView):
    """ Список каналов """

    model = Channel
    template_name = 'pages/list_channels_page.html'
    title = 'Рейтинг Каналов & стримеров' + tag_title
    
    
    def get_queryset(self, **kwargs):
        channels = Channel.objects.filter(is_published=True)
        return channels
    

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user = self.request.user

        if not user.is_authenticated:
            user = get_user_id(self.request)

        context['title'] = self.title
        context['user_subscribers'] = get_user_subsribers_pk(user)
        context['user_sub'] = user
        context['user_id'] = user
        context['h1'] = 'Каналы & стримеры'
        context['user_subscribers'] = user.subscribers.count()
        context['filter_bool'] = True
        context['meta_description'] = meta_description
        context['meta_keywords'] = meta_keywords

        return context

class SubscribeListPage(DataMixin, ListView):
    """ Список каналов """

    model = Channel
    template_name = 'pages/list_channels_page.html'
    title = 'Подписки' + tag_title

    def get_queryset(self, **kwargs):

        user = self.get_user_data()

        return user['user'].subscribers.filter(is_published=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user = self.request.user

        if not user.is_authenticated:
            user = get_user_id(self.request)

        context['title'] = self.title
        context['user_subscribers'] = get_user_subsribers_pk(user)
        context['user_sub'] = user
        context['user_id'] = user
        context['h1'] = 'Подписки'
        context['user_subscribers'] = user.subscribers.count()
        context['meta_description'] = meta_description
        context['meta_keywords'] = meta_keywords

        return context


def get_channel_views(channel):
    video_list = Video.objects.filter(channel__pk=channel.pk)
    views = 0

    for video in video_list:
        views += video.views.count()

    return views


def get_channel_likes(channel):
    video_list = Video.objects.filter(channel__pk=channel.pk)
    likes = 0

    for video in video_list:
        likes += video.fake_likes

    return likes


def get_channel_videos(channel):
    videos = Video.objects.filter(channel__pk=channel.pk)

    return videos

def get_channel_by_slug(slug):
    return Channel.objects.get(slug=slug)

class ChannelDetailPage(ListView):
    """ Посмотреть канал """

    model = Video
    context_object_name = 'videos'
    template_name = 'pages/detail_channel_page.html'
    paginate_by = 16

    def get_queryset(self):
        videos = super().get_queryset()
        return videos.filter(channel__slug=self.kwargs['slug'], is_published=True)


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user = self.request.user

        if not user.is_authenticated:
            user = get_user_id(self.request)

        channel = get_channel_by_slug(self.kwargs['slug'])


        context['title'] = f'{channel} {tag_title}'
        context['channel_video_count'] = Video.objects.filter(channel__pk=channel.pk).count()
        context['channel_views'] = get_channel_views(channel)
        context['channel_likes'] = get_channel_likes(channel)
        context['subscribe_status'] = get_subscribe_status(user, channel)
        context['user_id'] = user.username
        context['user_subscribers'] = get_user_subscribers_count(user)
        context['channel'] = channel
        context['meta_description'] = meta_description
        context['meta_keywords'] = meta_keywords

        return context


class CategoryListPage(DataMixin, ListView):
    """ Категории """

    model = Category
    context_object_name = 'category_list'
    template_name = 'list-category-page/list-category-page.html'

    def get_queryset(self, **kwargs):
        categories = super().get_queryset()
        return categories.filter(is_published=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user = self.get_user_data()

        context['user_id'] = user['user']
        context['user_subscribers'] = user['user'].subscribers.count()
        context['title'] = 'Категории' + tag_title
        context['sub_title'] = 'Категории'
        context['meta_description'] = meta_description
        context['meta_keywords'] = meta_keywords

        return context



class SavedVideoPage(DataMixin, ListView):
    """ Категории """

    model = Video
    template_name = 'saved-video-page/saved-video-page.html'
    context_object_name = 'saved_video'
    paginate_by = 16


    def get_queryset(self, **kwargs):
        user = self.get_user_data()

        return user['user'].favorites.all()


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user_data = self.get_user_data()

        context['title'] = 'Сохраненные видео'
        context['user_id'] = user_data['user']
        context['user_subscribers'] = user_data['user'].subscribers.count()

        return context


class AddComment(View):
    """ Отзывы """

    def post(self, request):
        post = request.POST

        form = CommentForm()

        secret_key = settings.RECAPTCHA_PRIVATE_KEY

        # captcha verification
        data = {
            'response': post['g-recaptcha-response'],
            'secret': secret_key
        }

        resp = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        result_json = resp.json()

        video = Video.objects.get(pk=int(post['video_pk']))

        if post['text'] and result_json['success']:
            if post['text']:
                form = form.save(commit=False)
                form.text = post['text']

                if post['parent']:
                    form.review_id = int(post['parent'])

                form.video = video
                form.user_id = int(post['user_pk'])
                form.save()
                return JsonResponse({'status': 200})
            else:
                return JsonResponse({'status': 500})




def addCommentLike(request):
    """ Лайки к комментарию """

    post = request.POST

    comment_id = int(post['comment_id'])

    comment = Comment.objects.get(pk=comment_id)
    user = User.objects.get(pk=post['user_id'])

    user_like = comment.likes.filter(pk=post['user_id']).exists()

    if user_like:
        comment.likes.remove(user)
    else:
        comment.likes.add(user)

    return JsonResponse({'status': 200})


class Search(ListView):
    """ Поиск по сайту """

    template_name = 'search-page/search-page.html'
    context_object_name = 'video_list'
    paginate_by = 16

    def get_queryset(self):
        search = self.request.GET.get('search')

        videos = Video.objects.filter(Q(title__icontains=search) | Q(channel__title__icontains=search) | Q(category__title__icontains=search) | Q(tags__title__icontains=search)).distinct()
        
        print(videos)
        return videos

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        search_text = self.request.GET.get('search')

        context['title'] = f'Поиск "{search_text}"' + tag_title
        context['search'] = search_text
        return context


@require_GET
def robots_txt(request):
    sitemap = os.getenv('SITEMAP')
    lines = [
        "User-Agent: *",
        "Disallow: /search/",
        "Disallow: /saved/",
        "Disallow: /subscribe/",
        "Disallow: /register/",
        "Disallow: /login/",
        "Disallow: /pnet-admin/",
        "Disallow: /users/",
        "Disallow: /logout/",
        # "Disallow: /",
        # "Allow: /",
        f"Sitemap: {sitemap}",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")

@require_GET
def sitemap(request):
    site_map = []
    return HttpResponse("\n".join(site_map), content_type="text/xml")