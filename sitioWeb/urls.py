# sitioWeb/urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import(
    login_view ,
    registroView ,
    baseView ,
    perfil_view ,
    logout_request,
    ofertarMView ,
    agregar_al_carrito,
    cargar_provincias_por_departamento,
    eliminar_del_carrito,
    mis_materiales,
    detalle_producto,
    obtener_provincias,
    obtener_subcategorias,
    eliminar_producto,
    eliminar_productos,
    eliminar_imagenes,
    billetera_view,
    transaccion_view,
    guardar_colores
) # Asegúrate de importar tu vista
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('',baseView , name= 'base'),
    path('login/', login_view, name='login'),  # Define la URL para el login
    path('registro/',registroView,name='registro'),
    path('perfil/', perfil_view, name='perfil'),
    path('logout/',logout_request, name='logout'),#logout --es salirce o cerrar sesion
    path('ofertar/',ofertarMView,name = 'ofertar'),
    path('get_provincias/', cargar_provincias_por_departamento, name='get_provincias'),
    path('agregar/<int:producto_id>/', agregar_al_carrito, name='agregar_al_carrito'),
    path('eliminar/<int:producto_id>/', eliminar_del_carrito, name='eliminar_del_carrito'),
    path('perfil/mis-materiales/', mis_materiales, name='mis_materiales'),
    path('producto/<int:producto_id>/', detalle_producto, name='detalle_producto'),
    path('eliminar-imagenes/', eliminar_imagenes, name='eliminar_imagenes'),
    path('subcategorias/<int:categoria_id>/', obtener_subcategorias, name='obtener_subcategorias'),
    path('provincias/<int:departamento_id>/', obtener_provincias, name='obtener_provincias'),
    path('producto/eliminar/<int:producto_id>/',eliminar_producto, name='eliminar_producto'),
    #path('eliminar_productos/', eliminar_productos, name='eliminar_productos'),
    path('perfil/mis-materiales/eliminar/', eliminar_productos, name='eliminar_productos'),
    path('billetera/', billetera_view, name='billetera'),
    path('transaccion/', transaccion_view, name='transaccion'),
    path('guardar-colores/', guardar_colores, name='guardar_colores'),

    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    