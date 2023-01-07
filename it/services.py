from pathlib import Path
import random
from typing import IO, Generator
from django.shortcuts import get_object_or_404
from .models import Video, User


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    
    return ip

def create_user_by_ip(ip):
    randomNum = random.randint(100000000, 999999999)
    user = User.objects.create_user(username=f'Гость ID {randomNum}', ip=ip)
    
    return user


def get_user_by_ip(request):
    ip = get_client_ip(request)
    
    user = User.objects.filter(ip=ip)
    
    if not user.exists():
        user = create_user_by_ip(ip)
        
    return user[0]


# video player

def ranged(
        file: IO[bytes],
        start: int = 0,
        end: int = None,
        block_size: int = 8192,
) -> Generator[bytes, None, None]:
    consumed = 0

    file.seek(start)
    while True:
        data_length = min(block_size, end - start - consumed) if end else block_size
        if data_length <= 0:
            break
        data = file.read(data_length)
        if not data:
            break
        consumed += data_length
        yield data

    if hasattr(file, 'close'):
        file.close()


def open_file(request, video_pk: int, size: int) -> tuple:
    _video = get_object_or_404(Video, pk=video_pk)

    if size == 480:
        path = Path(_video.video480p.path)
    elif size == 720:
        path = Path(_video.video720p.path)
    else:
        path = Path(_video.video1080p.path)

    file = path.open('rb')
    file_size = path.stat().st_size

    content_length = file_size
    status_code = 200
    content_range = request.headers.get('range')

    if content_range is not None:
        content_ranges = content_range.strip().lower().split('=')[-1]
        range_start, range_end, *_ = map(str.strip, (content_ranges + '-').split('-'))
        range_start = max(0, int(range_start)) if range_start else 0
        range_end = min(file_size - 1, int(range_end)) if range_end else file_size - 1
        content_length = (range_end - range_start) + 1
        file = ranged(file, start=range_start, end=range_end + 1)
        status_code = 206
        content_range = f'bytes {range_start}-{range_end}/{file_size}'

    return file, status_code, content_length, content_range