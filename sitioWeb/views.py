from django.shortcuts import render, redirect, get_object_or_404
from django.urls import path
from django.contrib import admin
from .models import Usuario , Producto ,Categoria,CarritoProducto , Departamento,Provincia,subCategoria,EstadoDelProducto,Imagenes,ConfiguracionLogo,ComisionAdmin
from django.http import HttpResponse ,JsonResponse,HttpResponseRedirect
from django.contrib.auth import authenticate, login ,logout , authenticate
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.db import transaction

from django.shortcuts import redirect
from django.contrib import messages
from decimal import Decimal, ROUND_HALF_UP,InvalidOperation



def billetera_view(request):
    # Verifica si el usuario está autenticado
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    # Obtiene el usuario actual
    usuario = get_object_or_404(Usuario, idUsuario=user_id)
    carritos = CarritoProducto.objects.filter(usuario=usuario, producto__estado_producto=True)
    cantidad_carrito = carritos.count()
    colores_personalizados = PersonalizarColores.objects.filter(usuario_id=user_id).first()
    config_logo = ConfiguracionLogo.objects.first()
    if request.method == 'POST':
        accion = request.POST.get('accion')  # Identifica la acción
        try:
            monto = Decimal(request.POST.get('monto_recarga') or 
                            request.POST.get('monto_transferencia') or 
                            request.POST.get('monto_retiro', 0))
            # Redondear a 2 decimales
            monto = monto.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        except (TypeError, ValueError, InvalidOperation):
            messages.error(request, "El monto ingresado no es válido.")
            return redirect('billetera')

        if monto <= 0:
            messages.error(request, "El monto debe ser mayor a 0.")
            return redirect('billetera')

        if accion == 'recargar':
            usuario.billetera += monto
            usuario.save()
            messages.success(request, 'Saldo recargado exitosamente.')
        elif accion == 'transferir':
            correo_destinatario = request.POST.get('correo_destinatario')
            try:
                destinatario = get_object_or_404(Usuario, correo=correo_destinatario)
                if monto > usuario.billetera:
                    messages.error(request, 'Saldo insuficiente para transferir.')
                else:
                    comision = (monto * Decimal(0.1)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                    usuario.billetera -= monto
                    destinatario.billetera += (monto - comision)
                    admin = get_object_or_404(Usuario, nombre='ADMIN')
                    admin.billetera += comision
                    usuario.save()
                    destinatario.save()
                    admin.save()
                    messages.success(request, f'Transferencia realizada exitosamente. Comisión: {comision} Bs.')
            except Usuario.DoesNotExist:
                messages.error(request, 'El destinatario no existe.')
        elif accion == 'retirar':
            if monto > usuario.billetera:
                messages.error(request, 'Saldo insuficiente para retirar.')
            else:
                usuario.billetera -= monto
                usuario.save()
                messages.success(request, 'Retiro realizado exitosamente.')
        else:
            messages.error(request, 'Acción no válida.')

        return redirect('billetera')

    # Renderiza la vista de la billetera
    return render(request, 'billetera.html', {
        'user': usuario,
        'saldo': usuario.billetera,
        'carritos': carritos,
        'cantidad_carrito': cantidad_carrito,
        'is_profile_page': True,
        'config_logo': config_logo,
        'temitas': colores_personalizados,
        'user_id': user_id,
    })



# Verifica si el usuario está autenticado antes de mostrar el carrito
def transaccion_view(request):
    # Verifica si el usuario está autenticado
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    # Obtiene el usuario y los productos en su carrito
    usuario = get_object_or_404(Usuario, idUsuario=user_id)
    productos_en_carrito = CarritoProducto.objects.filter(usuario=usuario)
    cantidad_carrito = productos_en_carrito.count()
    colores_personalizados = PersonalizarColores.objects.filter(usuario_id=user_id).first()
    config_logo = ConfiguracionLogo.objects.first()
    # Verifica si el carrito está vacío
    if not productos_en_carrito.exists():
        messages.info(request, 'No tienes productos en tu carrito.')
        return redirect('base')

    # Calcula el total y la comisión
    total = sum(item.producto.precio for item in productos_en_carrito)
    comision = (total * Decimal(0.1)).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
    total_con_comision = (total + comision).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

    # Procesa la confirmación de compra
    if request.method == 'POST' and 'confirmar_compra' in request.POST:
        # Verifica que el usuario tenga saldo suficiente
        if usuario.billetera < total_con_comision:
            messages.error(request, "No tienes suficiente saldo en tu billetera para esta compra.")
            return redirect('transaccion')

        # Transacción de compra
        try:
            with transaction.atomic():
                # Transfiere el dinero a los propietarios de los productos y desactiva el producto
                for item in productos_en_carrito:
                    producto = item.producto
                    propietario = producto.usuario
                    if propietario != usuario:  # Evita transferencias a sí mismo
                        propietario.billetera += producto.precio
                        propietario.save()

                    # Marca el producto como inactivo
                    producto.estado_producto = False
                    producto.save()

                # Deduce el total (incluyendo comisión) de la billetera del usuario
                usuario.billetera -= total_con_comision
                usuario.save()

                
                # Actualiza la tabla ComisionAdmin con la comisión
                comision_admin, created = ComisionAdmin.objects.get_or_create(id=1)
                comision_admin.monto_acumulado += comision
                comision_admin.save()

                # Vacía el carrito
                productos_en_carrito.delete()

                messages.success(request, "Compra confirmada. Los pagos se han realizado correctamente y los productos fueron desactivados.")

        except Exception as e:
            messages.error(request, f"Ocurrió un error al procesar la compra: {e}")
            return redirect('transaccion')

        return redirect('base')

    # Renderiza la vista de transacción
    return render(request, 'transaccion.html', {
        'user': usuario,
        'carritos': productos_en_carrito,
        'total': total,
        'comision': comision,
        'total_comision': total_con_comision,
        'saldo': usuario.billetera,
        'cantidad_carrito': cantidad_carrito,
        'is_profile_page': True,
        'config_logo': config_logo,
        'temitas':colores_personalizados
    })

from .models import PersonalizarColores
from .models import Usuario, PersonalizarColores



# Create your views here.
def baseView(request):
    '''Esto es la página principal'''
        
    user_id = request.session.get('user_id')
    print(user_id)
    user = None
    if user_id:
        user = Usuario.objects.get(idUsuario=user_id)
        
    productos = Producto.objects.filter(estado_producto=True)  # solo mostraré los productos que estén activos
    categorias = Categoria.objects.prefetch_related('subcategorias').all()  # Obtiene todas las categorías y sus subcategorías   
    carritos = CarritoProducto.objects.filter(usuario=user,producto__estado_producto=True)
    cantidad_carrito = carritos.count()  # Calcula la cantidad de productos en el carrito
    config_logo = ConfiguracionLogo.objects.first()  # Obtiene el primer registro del logo
    colores_personalizados = PersonalizarColores.objects.filter(usuario_id=user_id).first()
    
    return render(request, "base.html", {
        'user': user,
        'productos': productos,
        'categorias': categorias,
        'carritos': carritos,
        'cantidad_carrito': cantidad_carrito,  # Añade el contador al contexto
        'config_logo': config_logo,
        'temitas': colores_personalizados
    })

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = Usuario.objects.filter(nombre=username, contraseña=password).first()

        if user:
            if user.estadoUsuario:
                request.session['user_id'] = user.idUsuario
                request.session['username'] = user.nombre
                messages.success(request, f'¡Bienvenido, {user.nombre}! Has iniciado sesión correctamente.')
                return redirect('base')
            else:
                messages.error(request, 'Tu cuenta está inactiva. Contacta con el soporte para más información.')
                return redirect('base')
        else:
            messages.error(request, 'Usuario o contraseña incorrectos')
            return redirect('base')

    # Mostrar el formulario de login si no se ha enviado un POST
    user_id = request.session.get('user_id')
    user = Usuario.objects.get(idUsuario=user_id) if user_id else None

    if not user:
        return redirect('/?login=1')

    return render(request, 'base.html')

# se añadio telefono con el valor de NumTelefono para mandarlo a la BD(celular)
def registroView(request):
    config_logo = ConfiguracionLogo.objects.first()
    if request.method == 'POST':
        # Obtener los datos del formulario
        nombre = request.POST.get('username')
        correo = request.POST.get('email')
        telefono = request.POST.get('NumTelefono')
        contraseña = request.POST.get('password')
        confirmar_contraseña = request.POST.get('confirmPassword')
        

        # Validación básica
        if contraseña != confirmar_contraseña:
            messages.error(request, 'Las contraseñas no coinciden.')
            return redirect('registro')

        if Usuario.objects.filter(correo=correo).exists():
            messages.error(request, 'El correo electrónico ya está registrado.')
            return redirect('registro')

        # Crear y guardar el usuario en la base de datos
        usuario = Usuario(nombre=nombre, correo=correo, contraseña=contraseña, celular=telefono)
        try:
            usuario.save()
            messages.success(request, 'Usuario registrado exitosamente.')
            return redirect('base')  # Redirige al login después del registro
        except ValidationError as e:
            messages.error(request, 'Ocurrió un error al guardar el usuario.')
            return redirect('registro')

    return render(request, 'registro.html',{'config_logo': config_logo})

def perfil_view(request):
    user_id = request.session.get('user_id')
    
    if not user_id:
        return redirect('login')  # Redirigir al login si no está autenticado
    
    user = Usuario.objects.get(idUsuario=user_id)
    carritos = CarritoProducto.objects.filter(usuario=user,producto__estado_producto=True)
    cantidad_carrito = carritos.count()
    config_logo = ConfiguracionLogo.objects.first()
    colores_personalizados = PersonalizarColores.objects.filter(usuario_id=user_id).first()

    if request.method == 'POST':
        # Si hay un archivo de imagen en la solicitud
        if 'imagenPerfil' in request.FILES:
            user.foto = request.FILES['imagenPerfil']  # Asigna la nueva imagen
        
        # Actualizar el nombre y el correo electrónico
        user.nombre = request.POST.get('nombre', user.nombre)  # Obtiene el nuevo nombre, o mantiene el antiguo
        user.correo = request.POST.get('correo', user.correo)  # Actualiza el correo electrónico

        nueva_contraseña = request.POST.get('contraseña')
        if nueva_contraseña:  # Si se proporcionó una nueva contraseña
            user.contraseña = nueva_contraseña  # Asigna la nueva contraseña

        nuevo_celular = request.POST.get('celular')
        if nuevo_celular:  # Si se proporcionó una nueva contraseña
            user.celular = nuevo_celular  # Asigna la nueva contraseña
            
        user.save()  # Guarda los cambios en la base de datos

    return render(request, 'perfil.html', {"user_id":user_id,'user': user,'is_profile_page': True,'carritos': carritos,'cantidad_carrito': cantidad_carrito,'config_logo': config_logo, "masTemas":colores_personalizados})

def logout_request(request):
    logout(request)
    messages.info(request, "Saliste exitosamente")
    return redirect("base")
#para eliminar
#@login_required
def eliminar_del_carrito(request, producto_id):
    if request.method == "DELETE":
        try:
            #obtenemos al usuario primero
            user_id = request.session.get('user_id')
            user = Usuario.objects.get(idUsuario=user_id)
            #obtenemos al carrito que quiere eliminar si hay un error nos mostrara la pagina 404
            carrito_item = get_object_or_404(CarritoProducto, usuario=user, producto__id=producto_id)
            carrito_item.delete()
            mensaje = f"El producto ha sido eliminado del carrito."
            
             # Cantidad de productos en el carrito después de eliminar
            cantidad_carrito = CarritoProducto.objects.filter(usuario=user,producto__estado_producto=True).count()

            # Recuperar todos los productos en el carrito
            productos_en_carrito = CarritoProducto.objects.filter(usuario=user,producto__estado_producto=True)
            lista_productos = [{'id': item.producto.id, 'nombre': item.producto.nombre, 'precio': int(item.producto.precio)} for item in productos_en_carrito]

            return JsonResponse({
                'mensaje': mensaje,
                'success': True,
                'productos': lista_productos,  # Enviar la lista de productos en el carrito
                'cantidad_carrito': cantidad_carrito  # Nueva cantidad de productos en el carrito
            })
        except Exception as e:
            return JsonResponse({'mensaje': 'Error al eliminar el producto.', 'success': False}, status=500)

    return JsonResponse({'mensaje': 'Método no permitido.', 'success': False}, status=405)


@require_POST
def agregar_al_carrito(request, producto_id):
    print(f"Solicitud recibida: {request.method} para producto ID: {producto_id}")

    if request.method == "POST":
        try:
            producto = get_object_or_404(Producto, id=producto_id)
            print(f"Producto encontrado: {producto.nombre}")
            user_id = request.session.get('user_id')
            user = Usuario.objects.get(idUsuario=user_id)
            print(f"Usuario encontrado: {user.nombre}")

            # Verificación: Evitar que el usuario agregue su propio producto
            if producto.usuario == user:
                mensaje = "No puedes agregar tu propio producto al carrito."
                print(mensaje)
                return JsonResponse({'mensaje': mensaje, 'success': False})


            carrito_producto, created = CarritoProducto.objects.get_or_create(usuario=user, producto=producto)
            print(f"Item del carrito {'creado' if created else 'ya existente'}: {carrito_producto}")

            if created:
                mensaje = f"El producto '{producto.nombre}' se agregó al carrito."
            else:
                mensaje = f"El producto '{producto.nombre}' ya está en tu carrito."

            # Cantidad de productos en el carrito después de agregar
            cantidad_carrito = CarritoProducto.objects.filter(usuario=user,producto__estado_producto=True).count()
            # Recuperar todos los productos en el carrito
            productos_en_carrito = CarritoProducto.objects.filter(usuario=user,producto__estado_producto=True)
            lista_productos = [{'id': item.producto.id, 'nombre': item.producto.nombre, 'precio': int(item.producto.precio)} for item in productos_en_carrito]

            print(f"Mensaje enviado: {mensaje}")
            return JsonResponse({
                'mensaje': mensaje,
                'success': True,
                'productos': lista_productos,  # Enviar la lista de productos en el carrito
                'cantidad_carrito': cantidad_carrito  # Nueva cantidad de productos en el carrito
            })

        except Exception as e:
            print(f"Error al agregar al carrito: {e}")
            return JsonResponse({'mensaje': 'Error interno del servidor.', 'success': False}, status=500)

    print("Método no permitido.")
    return JsonResponse({'mensaje': 'Método no permitido.', 'success': False}, status=405)
  
# Vista para obtener provincias según el departamento seleccionado
def cargar_provincias_por_departamento(request):
    departamento_id = request.GET.get('departamento_id')
    if departamento_id:
        provincias = Provincia.objects.filter(departamento_id=departamento_id).values('id', 'nombre')
        return JsonResponse({'provincias': list(provincias)}, status=200)
    return JsonResponse({'error': 'No se encontraron provincias'}, status=404)


def ofertarMView(request):
    # Obtener el usuario desde la sesión
    user_id = request.session.get('user_id')
    carritos = CarritoProducto.objects.filter(usuario=user_id,producto__estado_producto=True)
    config_logo = ConfiguracionLogo.objects.first()
    
    
    
    # Si no hay usuario en sesión, redirigir al login
    if not user_id:
        return redirect('login')
    # Obtener el usuario o lanzar un 404 si no existe
    user = get_object_or_404(Usuario, idUsuario=user_id)
    cantidad_carrito = carritos.count()
    colores_personalizados = PersonalizarColores.objects.filter(usuario_id=user_id).first()

    if request.method == 'POST':
        # Obtener los datos del formulario
        titulo = request.POST.get('titulo')
        provincia = request.POST.get('provincia')
        direccion = request.POST.get('urlMapa')
        material = request.POST.get('material')
        precio = request.POST.get('precio')
        estados = request.POST.get('estado')
        descripcion = request.POST.get('descripcion')

        print(f"Material recibido: {material}")
        print(f"provincia: {provincia}")
        print(f"estado: {estados}")
        # Recuperar las instancias necesarias
        subcategoria_obj = subCategoria.objects.get(nombre=material)
        estado_obj = EstadoDelProducto.objects.get(estado=estados)
        provincia_obj = Provincia.objects.get(nombre=provincia)

        # Crear el nuevo producto
        producto = Producto(
            nombre=titulo,
            provincia=provincia_obj,
            direccion=direccion,
            subcategoria=subcategoria_obj,
            precio=precio,
            descripcion=descripcion,
            estado=estado_obj,
            usuario=user  # Relacionar el producto con el usuario actual
        )

        # Guardar el producto
        producto.save()

        # Guardar las imágenes subidas
        for archivo in request.FILES.getlist('archivo'):
            imagen = Imagenes(ruta=archivo, producto=producto)
            imagen.save()

        #messages.success(request, '¡Oferta creada exitosamente!')
        return redirect('base')

    # Si la solicitud es GET, renderizar el formulario con el usuario
    return render(request, 'ofertar.html', {'user_id':user_id,'user': user,'is_profile_page': True,'carritos': carritos,'cantidad_carrito': cantidad_carrito,'config_logo': config_logo,'temitas':colores_personalizados})


def mis_materiales(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')
    user = get_object_or_404(Usuario, idUsuario=user_id)

    carritos = CarritoProducto.objects.filter(usuario=user_id,producto__estado_producto=True)
    config_logo = ConfiguracionLogo.objects.first()
    cantidad_carrito = carritos.count()
    # Recupera todos los productos del usuario autenticado
    productos = Producto.objects.filter(usuario=user_id)
    colores_personalizados = PersonalizarColores.objects.filter(usuario_id=user_id).first()

    # Filtra los productos si se selecciona una opción en el filtro
    filtro = request.GET.get('filtro')
    if filtro == 'activos':
        productos = productos.filter(estado_producto=True)
    elif filtro == 'inactivos':
        productos = productos.filter(estado_producto=False)


    return render(request, 'productos_usuario.html', {'user_id':user_id,'user': user,'is_profile_page': True,'carritos': carritos,'misProductos': productos,'cantidad_carrito': cantidad_carrito,'config_logo': config_logo,'temitas':colores_personalizados})

def detalle_producto(request, producto_id):
    user_id = request.session.get('user_id')

    if not user_id:
        return redirect('login')
    
    user = get_object_or_404(Usuario, idUsuario=user_id)
    
    
    # Obtener el producto y verificar que pertenece al usuario autenticado
    producto = get_object_or_404(Producto, id=producto_id)

    # Verificar si el usuario actual es el propietario del producto
    if producto.usuario_id != user_id:  # Asumiendo que Producto tiene un campo usuario que es una ForeignKey a Usuario
        # Mostrar un mensaje de error y redirigir al usuario a otra página, como la lista de productos
        messages.error(request, "No tienes permiso para editar este material.")
        return redirect('mis_materiales')  # Redirige a una página segura



    carritos = CarritoProducto.objects.filter(usuario=user_id,producto__estado_producto=True)
    config_logo = ConfiguracionLogo.objects.first()
    cantidad_carrito = carritos.count()
    
    colores_personalizados = PersonalizarColores.objects.filter(usuario_id=user_id).first()

    #producto = get_object_or_404(Producto, id=producto_id)
    categorias = Categoria.objects.all()  # Traer todas las categorías
    subcategorias = subCategoria.objects.filter(categoria=producto.subcategoria.categoria)  # Subcategorías de la categoría del producto
    departamentos = Departamento.objects.all()  # Todos los departamentos
    provincias = Provincia.objects.filter(departamento=producto.provincia.departamento)  # Provincias del departamento del producto
    estados = EstadoDelProducto.objects.all()  # Todos los estados de los productos

    if request.method == 'POST':
        # Actualizar los datos del producto
        producto.nombre = request.POST.get('nombre')
        producto.descripcion = request.POST.get('descripcion')
        producto.precio = request.POST.get('precio')
        producto.subcategoria_id = request.POST.get('subcategoria')
        producto.provincia_id = request.POST.get('provincia')
        producto.estado_id = request.POST.get('estado')
        producto.estado_producto = 'estado_producto' in request.POST
        producto.direccion = request.POST.get('direccion')  # Guardar la dirección

        # Verificar que el nombre no sea nulo
        if not producto.nombre:
            messages.error(request, "El nombre del producto no puede estar vacío.")
            return render(request, 'detalle_producto.html', {'producto': producto, 'categorias': categorias, 'subcategorias': subcategorias, 'departamentos': departamentos, 'provincias': provincias, 'estados': estados})

        # Guardar el producto actualizado
        producto.save()

        # Procesar las nuevas imágenes
        if request.FILES.getlist('nuevas_imagenes'):
            for imagen in request.FILES.getlist('nuevas_imagenes'):
                Imagenes.objects.create(producto=producto, ruta=imagen)

       

        return redirect('detalle_producto', producto_id=producto.id)

    return render(request, 'detalle_producto.html', {
        'user': user,
        'is_profile_page': True,
        'carritos': carritos,
        'producto': producto,
        'categorias': categorias,
        'subcategorias': subcategorias,
        'departamentos': departamentos,
        'provincias': provincias,
        'estados': estados,
        'cantidad_carrito': cantidad_carrito,
        'config_logo': config_logo,
        'temitas':colores_personalizados,
        'user_id':user_id,
        #'imagenes': producto.imagenes.all(),
    })
def eliminar_imagenes(request):
    
    if request.method == 'POST':
        imagenes_a_eliminar = request.POST.getlist('imagenes_a_eliminar')
        
        for imagen_id in imagenes_a_eliminar:
            imagen = get_object_or_404(Imagenes, id=imagen_id)
            imagen.delete()
        
        # Retorna una respuesta de éxito como JSON
        return JsonResponse({'status': 'success', 'message': 'Imágenes eliminadas correctamente.'})
    
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

def obtener_subcategorias(request, categoria_id):
    subcategorias = subCategoria.objects.filter(categoria_id=categoria_id).values('id', 'nombre')
    return JsonResponse({'subcategorias': list(subcategorias)})

def obtener_provincias(request, departamento_id):
    provincias = Provincia.objects.filter(departamento_id=departamento_id).values('id', 'nombre')
    return JsonResponse({'provincias': list(provincias)})

def eliminar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)

    if request.method == 'POST':
        try:
            producto.delete()
            messages.success(request, 'El producto ha sido eliminado exitosamente.')
            return redirect('mis_materiales')  # Redirigir a la vista de productos o la página principal
        except Exception as e:
            messages.error(request, 'Hubo un problema al eliminar el producto: {}'.format(str(e)))
            return redirect('detalle_producto', producto_id=producto_id)

    # Para propósitos de prueba, permite eliminar también con GET (NO RECOMENDADO en producción)
    elif request.method == 'GET':
        try:
            producto.delete()
            messages.success(request, 'El producto ha sido eliminado exitosamente.')
            return redirect('mis_materiales')
        except Exception as e:
            messages.error(request, 'Hubo un problema al eliminar el producto: {}'.format(str(e)))
            return redirect('detalle_producto', producto_id=producto_id)

    messages.error(request, 'Método no permitido.')
    return redirect('detalle_producto', producto_id=producto_id)
@csrf_exempt  # Solo si tienes problemas con CSRF, de lo contrario no lo uses
def eliminar_productos(request):
    if request.method == 'POST':
        product_ids = json.loads(request.POST.get('product_ids', '[]'))

        # Eliminar los productos seleccionados
        Producto.objects.filter(id__in=product_ids).delete()

        # Redirigir de nuevo a la página anterior
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))

    return JsonResponse({'error': 'Método no permitido.'}, status=405)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import PersonalizarColores

@csrf_exempt
def guardar_colores(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        primary = data.get('primary')
        secondary = data.get('secondary')
        tertiary = data.get('tertiary')
        text = data.get('text')
        background = data.get('background')

        # Crear o actualizar la personalización de colores del usuario
        personalizar_colores, created = PersonalizarColores.objects.update_or_create(
            usuario_id=user_id,
            defaults={
                'primario': primary,
                'secundario': secondary,
                'terciario': tertiary,
                'texto': text,
                'fondo': background
            }
        )
        return JsonResponse({'status': 'success', 'message': 'Colores guardados correctamente'})

    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)




def obtener_colores_usuario(request, user_id):
    # Obtener la personalización de colores del usuario
    personalizacion = get_object_or_404(PersonalizarColores, usuario_id=user_id)
    
    # Asignar los valores de cada campo a variables independientes
    primario = personalizacion.primario
    secundario = personalizacion.secundario
    terciario = personalizacion.terciario
    texto = personalizacion.texto
    fondo = personalizacion.fondo
    
    # Pasar los valores al contexto de la plantilla o usarlos en la lógica
    return render(request, 'personalizar.html', {
        'primario': primario,
        'secundario': secundario,
        'terciario': terciario,
        'texto': texto,
        'fondo': fondo,
    })



def obtener_colores(request):
    # Obtén el user_id desde la sesión
    user_id = request.session.get('user_id')
    
    if not user_id:
        return redirect('login')  # Redirigir al login si no está autenticado
    
    # Obtener el usuario usando el user_id
    user = Usuario.objects.get(idUsuario=user_id)
    
    # Obtener solo el ID de los registros de PersonalizarColores asociados al usuario
    personalizar_colores = PersonalizarColores.objects.filter(usuario=user).values('id')
    
    # Puedes pasar estos IDs a la plantilla, si es necesario
    return render(request, 'colores.html', {"user_id": user_id, 'user': user, 'personalizar_colores': personalizar_colores})
