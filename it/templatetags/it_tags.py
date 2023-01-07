from django import template
from it.models import Category, Comment
from datetime import datetime


register = template.Library()

menu = [
    {'title': 'Главная', 'icon': 'inc/images/home.html', 'slug': 'home_page'},
    {'title': 'Категории', 'icon': 'inc/images/category.html', 'slug': 'category'},
    {'title': 'Каналы & стримеры', 'icon': 'inc/images/star.html', 'slug': 'channel'},
    {'title': 'Сохраненные видео', 'icon': 'inc/images/save.html', 'slug': 'saved'},
    {'title': 'Подписки', 'icon': 'inc/images/subscribe.html', 'slug': 'subscribe'},
]

@register.inclusion_tag('inc/category.html')
def get_categories(request):
    categories = Category.objects.filter(is_published=True).order_by('index')
    path = str(request.path).split('/')[-2]
    
    return {'categories': categories, 'path': path}


@register.simple_tag
def get_menu():
    return menu


@register.simple_tag
def get_current_path(request):
    path = str(request.path).split('/')[-2]
    
    if path == '':
        path = 'home_page'
    
    return path

# filters

@register.filter
def views_text(value):
    str = ''

    val = value % 10

    if value == 1:
        str = 'просмотр'
    elif value == 0:
        str = 'просмотров'
    elif value < 5:
        str = 'просмотра'
    elif value < 21:
        str = 'просмотров'
    elif val == 0:
        str = 'просмотров'
    elif val == 1:
        str = 'просмотр'
    elif val < 5:
        str = 'просмотра'
    else:
        str = 'просмотров'
        
    return str

@register.filter
def likes_text(value):
    str = ''
    
    val = value % 10
    
    if value == 1:
        str = 'лайк'
    elif value == 0:
        str = 'лайков'
    elif value < 5:
        str = 'лайка'
    elif value < 21:
        str = 'лайков'
    elif val == 0:
        str = 'лайков'
    elif val == 1:
        str = 'лайк'
    elif val < 5:
        str = 'лайка'
    else:
        str = 'лайков'
        
    return str


@register.filter
def views(value, context):
    if context == 'views':
        if value >= 1000000000:
            value = round(value / 1000000000, 1)
            value = str(value).replace('.', ',')
            return f'{value} млрд просмотров'
        elif value >= 1000000:
            value = round(value / 1000000, 1)
            value = str(value).replace('.', ',')
            return f'{value} млн просмотров'
        elif value >= 1000:
            value = round(value / 1000)
            value = str(value).replace('.', ',')
            return f'{value} тыс. просмотров'
        else:
            if value == 1:
                return f'{value} просмотр'
            elif value == 0:
                return f'{value} просмотров'
            elif value < 5:
                return f'{value} просмотра'
            elif value < 21:
                return f'{value} просмотров'
            elif value % 10 == 1:
                return f'{value} просмотр'
            elif value % 10 < 5:
                return f'{value} просмотра'
    else:
        if value >= 1000000000:
            value = round(value / 1000000000, 1)
            value = str(value).replace('.', ',')
            return f'{value} млрд'
        elif value >= 1000000:
            value = round(value / 1000000, 1)
            value = str(value).replace('.', ',')
            return f'{value} млн'
        elif value >= 1000:
            value = round(value / 1000)
            value = str(value).replace('.', ',')
            return f'{value} тыс.'
    
    return value


@register.filter
def subscribers(value):
    str = ''
    
    if value == 1:
        str = 'подписчик'
    elif value == 0:
        str = 'подписчиков'
    elif value < 5:
        str = 'подписчика'
    elif value < 21:
        str = 'подписчиков'
    elif value > 994:
        str = 'подписчиков'
    elif value % 10 == 1:
        str = 'подписчик'
    elif value % 10 == 0:
        str = 'подписчиков'
    elif value % 10 < 5:
        str = 'подписчика'
    else:
        str = 'подписчиков'
        
    return str

@register.filter
def percent(value, arg):
    if value == 0 or arg == 0:
        return 100
    sum = value + arg
    percent = value / sum * 100
    
    return int(percent)

@register.filter
def added(added: datetime):
    current = datetime.now(added.tzinfo)
    
    between = current - added
    
    btw_sec = int(between.total_seconds())
    
    result_time = ''
    
    if btw_sec < 60:
        result_time = str(int(btw_sec))
        
        if btw_sec > 9 and btw_sec < 21:
            result_time += ' секунд'
        elif btw_sec % 10 == 1:
            result_time += ' секунда'
        elif btw_sec % 10 < 5 and btw_sec % 10 != 0:
            result_time += ' секунды'
        else:
            result_time += ' секунд'
        
    elif btw_sec < 60 * 60:
        result_time = str(int(btw_sec / 60))
        btw_sec = int(btw_sec / 60)
        
        if btw_sec > 9 and btw_sec < 21:
            result_time += ' минут'
        elif btw_sec % 10 == 1:
            result_time += ' минута'
        elif btw_sec % 10 < 5 and btw_sec % 10 != 0:
            result_time += ' минуты'
        else:
            result_time += ' минут'
            
    elif btw_sec < 60 * 60 * 24:
        result_time = str(int(btw_sec / 60 / 60))
        tt = btw_sec
        btw_sec = int(btw_sec / 60 / 60)
        
        if btw_sec > 9 and btw_sec < 21:
            result_time += ' часов'
        elif btw_sec % 10 == 1:
            result_time += ' час'
        elif btw_sec % 10 < 5 and btw_sec % 10 != 0:
            result_time += ' часа'
        else:
            result_time += f' часов'
        
    elif between.days < 28:
        result_time = str(between.days)
        
        if between.days == 1:
            result_time += ' день'
        elif between.days < 5:
            result_time += ' дня'
        elif between.days < 7:
            result_time += ' дней'
        elif between.days < 14:
            result_time = ' 1 неделя'
        elif between.days < 21:
            result_time = ' 2 недели'
        else:
            result_time = ' 3 недели'
        
    elif between.days < 365:
        result_time = str(between.days / 30)
        month = int(between.days / 30)
        
        if month == 1:
            result_time += ' месяц'
        elif month < 5:
            result_time += ' месяца'
        else:
            result_time += ' месяцев'
            
    else:
        if int(between.days / 365) == 1:
            result_time = '1 год'
        elif int(between.days / 365) < 5:
            result_time = int(between.days / 365) + ' года'
        else:
            result_time = int(between.days / 365) + ' лет'
    
    return result_time


@register.filter
def bool_user_like(user_pk, comment_pk):

    comment = Comment.objects.get(pk=comment_pk)
    
    bool_like = comment.likes.filter(pk=user_pk).exists()

    return bool_like