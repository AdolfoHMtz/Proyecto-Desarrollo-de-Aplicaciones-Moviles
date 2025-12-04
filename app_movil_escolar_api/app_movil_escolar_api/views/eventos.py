from django.db import transaction
from rest_framework import permissions, generics, status
from rest_framework.response import Response
from django.contrib.auth.models import Group, User
from django.shortcuts import get_object_or_404

from app_movil_escolar_api.serializers import EventoAcademicoSerializer
from app_movil_escolar_api.models import EventosAcademicos

class EventosAll(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, *args, **kwargs):
        eventos = EventosAcademicos.objects.all().order_by("-id")
        lista = EventoAcademicoSerializer(eventos, many=True).data
        return Response(lista, 200)

class EventosView(generics.CreateAPIView):
    # Verifica que el usuario esté autenticado para las peticiones GET, PUT y DELETE
    def get_permissions(self):
        if self.request.method in ['GET', 'PUT', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return []  # POST no requiere autenticación (pero validaremos rol dentro)
    
    # Obtener evento por ID
    def get(self, request, *args, **kwargs):
        evento = get_object_or_404(EventosAcademicos, id=request.GET.get("id"))
        evento = EventoAcademicoSerializer(evento, many=False).data
        return Response(evento, 200)
    
    # Registrar nuevo evento
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        responsable_id = request.data.get("responsable")
        responsable = get_object_or_404(User, id=responsable_id)
        
        evento = EventosAcademicos.objects.create(
            nombre_evento=request.data.get("nombre_evento", ""),
            tipo_evento=request.data.get("tipo_evento", ""),
            fecha_realizacion=request.data.get("fecha_realizacion", None),
            hora_inicio=request.data.get("hora_inicio", None),
            hora_fin=request.data.get("hora_fin", None),
            lugar=request.data.get("lugar", ""),
            publico_objetivo=request.data.get("publico_objetivo", []),
            programa_educativo=request.data.get("programa_educativo", ""),
            responsable=responsable,
            descripcion=request.data.get("descripcion", ""),
            cupo_maximo=request.data.get("cupo_maximo", 0)
        )
        evento.save()
        
        return Response({"evento_created_id": evento.id}, 201)
    
    # Actualizar evento
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        permission_classes = (permissions.IsAuthenticated,)
        evento = get_object_or_404(EventosAcademicos, id=request.data["id"])

        evento.nombre_evento = request.data["nombre_evento"]
        evento.tipo_evento = request.data["tipo_evento"]
        evento.fecha_realizacion = request.data["fecha_realizacion"]
        evento.hora_inicio = request.data["hora_inicio"]
        evento.hora_fin = request.data["hora_fin"]
        evento.lugar = request.data["lugar"]
        evento.publico_objetivo = request.data["publico_objetivo"]
        evento.programa_educativo = request.data.get("programa_educativo", "")
        evento.descripcion = request.data["descripcion"]
        evento.cupo_maximo = request.data["cupo_maximo"]
        
        if "responsable" in request.data:
            responsable = get_object_or_404(User, id=request.data["responsable"])
            evento.responsable = responsable
        evento.save()
        
        return Response({"message": "Evento actualizado correctamente", "evento": EventoAcademicoSerializer(evento).data}, 200)
    
    # Eliminar evento
    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        evento = get_object_or_404(EventosAcademicos, id=request.GET.get("id"))
        try:
            evento.delete()
            return Response({"details": "Evento eliminado"}, 200)
        except Exception as e:
            return Response({"details": "Algo pasó al eliminar"}, 400)
