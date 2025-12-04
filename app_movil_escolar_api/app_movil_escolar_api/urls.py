from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views.bootstrap import VersionView
from app_movil_escolar_api.views import bootstrap
from app_movil_escolar_api.views import users
from app_movil_escolar_api.views import auth
from app_movil_escolar_api.views import alumnos
from app_movil_escolar_api.views import maestros
from app_movil_escolar_api.views import eventos

urlpatterns = [
    #Create Admin
        path('admin/', users.AdminView.as_view()),
    #Admin Data
        path('lista-admins/', users.AdminAll.as_view()),
    #Edit Admin
        #path('admins-edit/', users.AdminsViewEdit.as_view())
    #Create Alumno
        path('alumnos/', alumnos.AlumnosView.as_view()),
    #Alumno Data
        path('lista-alumnos/', alumnos.AlumnosAll.as_view()),
    #Create Maestro
        path('maestros/', maestros.MaestrosView.as_view()),
    #Maestro Data
        path('lista-maestros/', maestros.MaestroAll.as_view()),
    #Total Users
        path('total-users/', users.TotalUsers.as_view()),
    #Login
        path('login/', auth.CustomAuthToken.as_view()),
    #Logout
        path('logout/', auth.Logout.as_view()),
    #Create Evento
        path('eventos/', eventos.EventosView.as_view()),
    #Eventos Data
        path('lista-eventos/', eventos.EventosAll.as_view()),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
