from django.db import transaction
from rest_framework import permissions, generics, status
from rest_framework.response import Response
from django.contrib.auth.models import Group, User
from django.shortcuts import get_object_or_404

from app_movil_escolar_api.serializers import UserSerializer, AlumnoSerializer
from app_movil_escolar_api.models import Alumnos

class AlumnosAll(generics.CreateAPIView):
    #Aquí se valida la autenticación del usuario
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        alumnos = Alumnos.objects.filter(user__is_active = 1).order_by("id")
        lista = AlumnoSerializer(alumnos, many=True).data
        
        return Response(lista, 200)
    
class AlumnosView(generics.CreateAPIView):
    # Permisos por método (sobrescribe el comportamiento default)
    # Verifica que el usuario esté autenticado para las peticiones GET, PUT y DELETE
    def get_permissions(self):
        if self.request.method in ['GET', 'PUT', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return []  # POST no requiere autenticación
     
    #Obtener alumno por ID
    def get(self, request, *args, **kwargs):
        alumno = get_object_or_404(Alumnos, id = request.GET.get("id"))
        alumno = AlumnoSerializer(alumno, many=False).data
        # Si todo es correcto, regresamos la información
        return Response(alumno, 200)
   
    # Registrar nuevo alumno
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Serializamos los datos del alumno para volverlo de nuevo JSON
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
            # Cifrar la contraseña
            user.set_password(password)
            user.save()

            group, created = Group.objects.get_or_create(name=role)
            group.user_set.add(user)
            user.save()

            # Almacenar los datos adicionales del alumno
            alumno = Alumnos.objects.create(
                user=user,
                matricula=request.data.get("matricula", ""),
                telefono=request.data.get("telefono", ""),
                rfc=request.data.get("rfc", "").upper(),
                curp=request.data.get("curp", "").upper(),
                edad=request.data.get("edad", None),
                ocupacion=request.data.get("ocupacion", ""),
                fecha_nacimiento=request.data.get("fecha_nacimiento", None)
            )
            alumno.save()

            return Response({"alumno_created_id": alumno.id}, 201)

        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Actualizar / editar datos del alumno
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        # Verificamos que el usuario esté autenticado
        permission_classes = (permissions.IsAuthenticated,)
        # Primero obtenemos el alumno a actualizar
        alumno = get_object_or_404(Alumnos, id=request.data["id"])
        alumno.matricula = request.data["matricula"]
        alumno.telefono = request.data["telefono"]
        alumno.rfc = request.data["rfc"]
        alumno.curp = request.data["curp"]
        alumno.edad = request.data["edad"]
        alumno.ocupacion = request.data["ocupacion"]
        alumno.fecha_nacimiento = request.data["fecha_nacimiento"]
        alumno.save()
        # Actualizamos los datos del usuario asociado (tabla auth_user de Django)
        user = alumno.user
        user.first_name = request.data["first_name"]
        user.last_name = request.data["last_name"]
        user.save()
        
        return Response({"message": "Alumno actualizado correctamente", "alumno": AlumnoSerializer(alumno).data}, 200)
    
    # Eliminar alumno con delete (Borrar realmente)
    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        alumno = get_object_or_404(Alumnos, id=request.GET.get("id"))
        try:
            alumno.user.delete()
            return Response({"details":"Alumno eliminado"},200)
        except Exception as e:
            return Response({"details":"Algo pasó al eliminar"},400)
