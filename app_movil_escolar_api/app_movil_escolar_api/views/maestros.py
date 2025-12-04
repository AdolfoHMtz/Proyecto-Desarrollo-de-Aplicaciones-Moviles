from django.db import transaction
from rest_framework import permissions, generics, status
from rest_framework.response import Response
from django.contrib.auth.models import Group, User
from django.shortcuts import get_object_or_404

from app_movil_escolar_api.serializers import UserSerializer, MaestroSerializer
from app_movil_escolar_api.models import Maestros


class MaestroAll(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = request.user
        # Obtener todos los maestros
        maestros = Maestros.objects.all()
        serializer = MaestroSerializer(maestros, many=True)
        return Response(serializer.data, 200)

class MaestrosView(generics.CreateAPIView):
    # Permisos por método (sobrescribe el comportamiento default)
    # Verifica que el usuario esté autenticado para las peticiones GET, PUT y DELETE
    def get_permissions(self):
        if self.request.method in ['GET', 'PUT', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return []  # POST no requiere autenticación
    
   #Obtener maestro por ID
    def get(self, request, *args, **kwargs):
        maestro = get_object_or_404(Maestros, id = request.GET.get("id"))
        maestro = MaestroSerializer(maestro, many=False).data
        # Si todo es correcto, regresamos la información
        return Response(maestro, 200)
    
    # Registrar nuevo maestro
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Serializamos los datos del maestro para volverlo de nuevo JSON
        user = UserSerializer(data=request.data)

        if user.is_valid():
            # Grab user data
            role = request.data['rol']
            first_name = request.data['first_name']
            last_name = request.data['last_name']
            email = request.data['email']
            password = request.data['password']
            # Valida si existe el usuario o bien el email registrado
            existing_user = User.objects.filter(email=email).first()
            if existing_user:
                return Response({"message": "Username " + email + ", is already taken"}, 400)
            user = User.objects.create(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name,
                is_active=1
            )
            user.save()
            user.set_password(password)
            user.save()
            
            group, created = Group.objects.get_or_create(name=role)
            group.user_set.add(user)
            user.save()
            #Create a profile for the user
            maestro = Maestros.objects.create(
                user=user,
                id_trabajador=request.data.get("id_trabajador", ""),
                telefono=request.data.get("telefono", ""),
                rfc=request.data.get("rfc", "").upper(),
                cubiculo=request.data.get("cubiculo", ""),
                area_investigacion=request.data.get("area_investigacion", ""),
                materias_json=request.data.get("materias_json", []),
                fecha_nacimiento=request.data.get("fecha_nacimiento", None)
            )
            maestro.save()

            return Response({"maestro creado con ID": maestro.id}, 201)

        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

    
    # Actualizar / editar datos del maestro
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        # Verificamos que el usuario esté autenticado
        permission_classes = (permissions.IsAuthenticated,)
        # Primero obtenemos el maestro a actualizar
        maestro = get_object_or_404(Maestros, id=request.data["id"])
        maestro.id_trabajador = request.data["id_trabajador"]
        maestro.telefono = request.data["telefono"]
        maestro.rfc = request.data["rfc"]
        maestro.cubiculo = request.data["cubiculo"]
        maestro.area_investigacion = request.data["area_investigacion"]
        maestro.materias_json = request.data["materias_json"]
        maestro.fecha_nacimiento = request.data["fecha_nacimiento"]
        maestro.save()
        # Actualizamos los datos del usuario asociado (tabla auth_user de Django)
        user = maestro.user
        user.first_name = request.data["first_name"]
        user.last_name = request.data["last_name"]
        user.save()
        
        return Response({"message": "Maestro actualizado correctamente", "maestro": MaestroSerializer(maestro).data}, 200)
    
    # Eliminar maestro con delete (Borrar realmente)
    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        maestro = get_object_or_404(Maestros, id=request.GET.get("id"))
        try:
            maestro.user.delete()
            return Response({"details":"Maestro eliminado"},200)
        except Exception as e:
            return Response({"details":"Algo pasó al eliminar"},400)