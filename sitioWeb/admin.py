from django.contrib import admin
from .models import Usuario ,Categoria, subCategoria , Producto , Imagenes ,Departamento,Provincia,EstadoDelProducto,CarritoProducto,ConfiguracionLogo,ComisionAdmin

from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django import forms

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    fields=["nombre","correo","estadoUsuario","celular","fecha_creacion"]
    list_display =["nombre","correo","estadoUsuario"] #lo que se va mostrar
    readonly_fields = ["nombre","correo","celular","fecha_creacion"]  # Estos campos no son editables
    list_editable = ["estadoUsuario"]  # Permite editar el campo estadoUsuario desde la lista
    actions = None  # Esto elimina la acción de "Eliminar usuarios seleccionados" en el panel

    # Desactivar la opción de añadir nuevos usuarios
    def has_add_permission(self, request):
        return False
admin.site.register(Usuario,UserAdmin)#forma para registrar 1


@admin.register(ComisionAdmin)
class ComisionAdminAdmin(admin.ModelAdmin):
    list_display = ('id', 'monto_acumulado', 'fecha_actualizacion')  # Campos a mostrar en la lista del admin
    readonly_fields = ('fecha_actualizacion',)  # Este campo no es editable
    list_editable = ('monto_acumulado',)  # Permite editar el monto acumulado directamente en la lista

    def has_add_permission(self, request):
        """
        Restringe la posibilidad de agregar múltiples registros.
        Solo debe haber un único registro de ComisionAdmin.
        """
        if ComisionAdmin.objects.exists():
            return False
        return True


@admin.register(ConfiguracionLogo)
class ConfiguracionAdmin(admin.ModelAdmin):
    fields = ["nombre", "logo", "fecha_creacion"]  # Mostrar 'nombre', 'logo' y 'fecha_creacion' en el formulario de detalles
    readonly_fields = ["nombre", "fecha_creacion"]  # Estos campos no son editables
    list_display = ["nombre", "logo"]  # Mostrar 'nombre' y 'logo' en el listado
    list_display_links = ["nombre"]  # 'nombre' será el enlace clicable
    list_editable = ["logo"]  # Solo 'logo' será editable directamente en la lista
    actions = None  # Desactivar las acciones


    def has_add_permission(self, request):
        # Permitir agregar solo si no existe ningún registro
        if ConfiguracionLogo.objects.exists():
            return False
        return True

@admin.register(Categoria)#forma para registrar 2
class CategoriaAdmin(admin.ModelAdmin):#lo que se puede editar
    fields=["nombre"]
    list_display =["nombre"]

@admin.register(subCategoria)#forma para registrar 2
class subCategoriaAdmin(admin.ModelAdmin):#lo que se puede editar
    fields=["nombre","categoria"]
    list_display =["nombre","categoria"]

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    fields=["nombre","estado_producto","descripcion","precio","usuario","subcategoria","provincia","estado","direccion"]
    list_display =["nombre","precio","subcategoria"]

@admin.register(Imagenes)
class ProductImageAdmin(admin.ModelAdmin):
    fields=["ruta","producto"]
    list_display =["ruta","producto"]

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    fields=["nombre"]
    list_display =["nombre"]

@admin.register(Provincia)
class ProvinciaAdmin(admin.ModelAdmin):
    fields=["nombre","departamento"]
    list_display =["nombre","departamento"]
    
@admin.register(EstadoDelProducto)
class EstadoProductoAdmin(admin.ModelAdmin):
    fields=["estado"]
    list_display =["estado"]

@admin.register(CarritoProducto)
class CarritoAdmin(admin.ModelAdmin):
    fields=["usuario","producto"]
    list_display=["usuario","producto"]