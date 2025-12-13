from django.contrib import admin
from django.urls import include, path
from django.conf import settings            # Importar settings
from django.conf.urls.static import static  # Importar static

from sitioWeb.views import baseView, login_view, registroView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('sitioWeb.urls')),
]

# Esto es lo que te falta:
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)