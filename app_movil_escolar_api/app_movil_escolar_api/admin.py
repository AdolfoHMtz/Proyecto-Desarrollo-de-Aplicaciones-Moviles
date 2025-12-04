from django.contrib import admin
from django.utils.html import format_html
from app_movil_escolar_api.models import *


@admin.register(Administradores)
class AdminsAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "creation", "update")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name")

@admin.register(Alumnos)
class AlumnosAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "matricula", "creation", "update")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name", "matricula")

@admin.register(Maestros)
class MaestrosAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "id_trabajador", "creation", "update")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name", "id_trabajador")

