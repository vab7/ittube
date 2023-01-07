from django.urls import path
from .views import *
from django.views.decorators.cache import cache_page


HOUR = 0.01

urlpatterns = [
    path('', cache_page(HOUR)(HomePage.as_view()), name='home_page'),
    path('video/like/', add_video_like, name='add_video_like'),
    path('video/dislike/', add_video_dislike, name='add_video_dislike'),
    path('video/favorite/', add_video_favorite, name='add_video_favorite'),
    path('video/subscribe/channel/', subscribe_user_channel, name='subscribe_user_channel'),
    path('video/<slug:slug>/', VideoDetail.as_view(), name='video_detail'),
    path('video/streem/<int:pk>/<int:size>/', get_streaming_video, name='stream_video'),
    path('category/<slug:slug>/', cache_page(HOUR)(CategoryVideo.as_view()), name='category_video'),
    path('category/', cache_page(HOUR)(CategoryListPage.as_view()), name='category'),
    path('subscribe/', SubscribeListPage.as_view(), name='subscribe'),
    
    path('comment/', AddComment.as_view(), name='add_comment'),
    path('comment/like/', addCommentLike, name='add_comment_like'),
    # path('comment/filter/', filterComment, name='filter_comment'),
    path('channel/', cache_page(HOUR)(ChannelsListPage.as_view()), name='channel'),
    path('channel/<slug:slug>/', cache_page(HOUR)(ChannelDetailPage.as_view()), name='channel_detail'),
    path('saved/', SavedVideoPage.as_view(), name='saved'),
    path('login/', LoginUser.as_view(), name='login_user'),
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('logout/', LogoutUser.as_view(), name='logout_user'),
    path('search/', Search.as_view(), name='search'),
    
    # robots, sitemap
    path('robots.txt/', robots_txt),
    path('sitemap.xml/', sitemap),
]
