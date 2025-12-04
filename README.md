# Proyecto Final - Desarrollo de Aplicaciones Móviles

# Sistema de Gestión Académica Escolar

Este proyecto consiste de un Sistema completo de gestión académica desarrollado con **Angular** (frontend) y **Django REST Framework** (backend). Permite administrar usuarios (administradores, maestros y alumnos), gestionar eventos académicos y visualizar graficas de estadísticas.

---

## Características Principales

### Gestión de Usuarios

- **Administradores**: Control total del sistema, pueden gestionar todos los usuarios y eventos
- **Maestros**: Pueden gestionar alumnos y consultar eventos dirigidos a profesores
- **Alumnos**: Consultan información académica y eventos para estudiantes

### Gestión de Eventos Académicos

- CRUD completo de eventos (Create, Read, Update, Delate)
- Tipos de eventos: Conferencias, Talleres, Seminarios, Concursos
- Información detallada: fecha, horarios, lugar, público objetivo, responsable, cupo máximo
- Filtrado automático de eventos según rol de usuario
- Validaciones de formularios en frontend y backend

### Dashboard y Estadísticas

- Gráficas dinámicas en tiempo real (Línea, Barras, Circular, Dona)
- Estadísticas de usuarios por rol

### Seguridad

- Autenticación mediante JWT Bearer Token
- Sistema de permisos basado en roles
- Filtrado de información según tipo de usuario

---

## Tecnologías Utilizadas

### Frontend

| Tecnología           | Versión | Descripción              |
| -------------------- | ------- | ------------------------ |
| **Angular**          | 16      | Framework principal      |
| **Angular Material** | 16      | Componentes UI           |
| **TypeScript**       | 5       | Lenguaje de programación |

### Backend

| Tecnología                | Versión | Descripción              |
| ------------------------- | ------- | ------------------------ |
| **Python**                | 3.10    | Lenguaje de programación |
| **Django**                | 4.2.    | Framework web            |
| **Django REST Framework** | 3.14    | API REST                 |

---

## Estructura del Proyecto

```
Proyecto-Desarrollo-de-Aplicaciones-Moviles/
│
├── app-movil-escolar-webapp/          # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── layouts/               # Layouts
│   │   │   ├── screens/               # Pantallas principales
│   │   │   │   ├── login-screen/
│   │   │   │   ├── home-screen/
│   │   │   │   ├── admin-screen/
│   │   │   │   ├── maestros-screen/
│   │   │   │   ├── alumnos-screen/
│   │   │   │   ├── eventos-screen/
│   │   │   │   └── graficas-screen/
│   │   │   ├── partials/              # Componentes reutilizables
│   │   │   │   ├── navbar-user/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── registro-admin/
│   │   │   │   ├── registro-maestros/
│   │   │   │   ├── registro-alumnos/
│   │   │   │   └── registro-eventos/
│   │   │   ├── modals/                # Modales
│   │   │   ├── services/              # Servicios HTTP
│   │   │   └── shared/                # Utilidades compartidas
│   │   ├── assets/                    # Imágenes y fuentes
│   │   └── environments/              # Configuración de entornos
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── app_movil_escolar_api/             # Backend Django
│   ├── app_movil_escolar_api/
│   │   ├── models.py                  # Modelos de datos
│   │   ├── serializers.py             # Serializadores DRF
│   │   ├── settings.py                # Configuración Django
│   │   ├── urls.py                    # Rutas principales
│   │   ├── views/                     # Vistas de la API
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── alumnos.py
│   │   │   ├── maestros.py
│   │   │   └── eventos.py
│   │   └── migrations/                # Migraciones de BD
│   ├── static/
│   ├── manage.py
│___├── requirements.txt               # Dependencias Python

```

---

## Requisitos Previos (Para utilizar este proyecto en Local)

Asegúrate de tener instalado:

- **Node.js** v18+ y **npm** v9+
- **Python** 3.10 o superior
- **Git**

---

## Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/AdolfoHMtz/Proyecto-Desarrollo-de-Aplicaciones-Moviles.git
cd Proyecto-Desarrollo-de-Aplicaciones-Moviles
```

### 2️⃣ Configuración del Backend (Django)

#### Paso 1: Crear entorno virtual

```bash
cd app_movil_escolar_api
python -m venv env
```

#### Paso 2: Activar entorno virtual

**Windows (PowerShell):**

```powershell
.\env\Scripts\Activate.ps1
```

**Windows (CMD):**

```cmd
.\env\Scripts\activate.bat
```

**Linux/Mac:**

```bash
source env/bin/activate
```

#### Paso 3: Instalar dependencias

```bash
pip install -r requirements.txt
```

#### Paso 4: Configurar base de datos

1. Crear base de datos en MySQL:

```sql
CREATE DATABASE app_escolar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Editar `app_movil_escolar_api/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'app_escolar',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### Paso 5: Ejecutar migraciones

```bash
python manage.py migrate
```

#### Paso 7: Iniciar servidor

```bash
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

---

### 3️⃣ Configuración del Frontend (Angular)

#### Paso 1: Instalar dependencias

```bash
cd app-movil-escolar-webapp
npm install
```

#### Paso 2: Configurar endpoint del backend

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  url_api: "http://localhost:8000/",
};
```

#### Paso 3: Iniciar aplicación

```bash
ng serve -o
```

La aplicación estará disponible en: `http://localhost:4200`

---

## Endpoints del API

### Autenticación

- `POST /login/` - Iniciar sesión
- `POST /logout/` - Cerrar sesión

### Usuarios

- `GET /lista-admins/` - Listar administradores
- `GET /lista-maestros/` - Listar maestros
- `GET /lista-alumnos/` - Listar alumnos
- `GET /total-users/` - Estadísticas de usuarios
- `POST /admin/` - Crear administrador
- `POST /maestros/` - Crear maestro
- `POST /alumnos/` - Crear alumno
- `PUT /admin/` - Actualizar administrador
- `PUT /maestros/` - Actualizar maestro
- `PUT /alumnos/` - Actualizar alumno
- `DELETE /admin/?id=<id>` - Eliminar administrador
- `DELETE /maestros/?id=<id>` - Eliminar maestro
- `DELETE /alumnos/?id=<id>` - Eliminar alumno

### Eventos Académicos

- `GET /lista-eventos/` - Listar todos los eventos
- `GET /eventos/?id=<id>` - Obtener evento por ID
- `POST /eventos/` - Crear nuevo evento
- `PUT /eventos/` - Actualizar evento
- `DELETE /eventos/?id=<id>` - Eliminar evento

---

## Funcionalidades por Rol

### Administrador

- ✅ Ver, crear, editar y eliminar todos los usuarios
- ✅ Ver, crear, editar y eliminar todos los eventos
- ✅ Acceso completo al dashboard y estadísticas

### Maestro

- ✅ Ver y gestionar (crear, editar, eliminar) alumnos
- ✅ Ver eventos dirigidos a "Profesores" y "Público general"
- ✅ Acceso a estadísticas

### Alumno

- ✅ Ver su información personal
- ✅ Ver eventos dirigidos a "Estudiantes" y "Público general"
- ✅ Acceso limitado al dashboard

---

## Componentes Principales del Frontend

### Screens

- **login-screen**: Pantalla de inicio de sesión
- **home-screen**: Dashboard principal con resumen
- **admin-screen**: Lista y gestión de administradores
- **maestros-screen**: Lista y gestión de maestros
- **alumnos-screen**: Lista y gestión de alumnos
- **eventos-screen**: Lista y gestión de eventos académicos
- **graficas-screen**: Visualización de estadísticas con gráficas
- **registro-usuarios-screen**: Formulario de registro/edición

### Partials

- **navbar-user**: Barra de navegación superior
- **sidebar**: Menú lateral de navegación
- **registro-admin**: Formulario de administradores
- **registro-maestros**: Formulario de maestros
- **registro-alumnos**: Formulario de alumnos
- **registro-eventos**: Formulario de eventos académicos

### Services

- **facade.service**: Gestión de sesión y token
- **administradores.service**: Operaciones CRUD de administradores
- **maestros.service**: Operaciones CRUD de maestros
- **alumnos.service**: Operaciones CRUD de alumnos
- **eventos-academicos.service**: Operaciones CRUD de eventos
- **validator.service**: Validaciones de formularios
- **errors.service**: Mensajes de error

---

## Modelos de Datos

### User

- username
- email
- password
- first_name
- last_name
- is_active

### Administradores

- user (FK a User)
- clave_admin
- telefono
- rfc
- edad
- ocupacion

### Maestros

- user (FK a User)
- id_trabajador
- telefono
- rfc
- cubiculo
- area_investigacion
- materias_json (JSONField)
- fecha_nacimiento

### Alumnos

- user (FK a User)
- matricula
- telefono
- rfc
- curp
- edad
- ocupacion
- fecha_nacimiento

### EventosAcademicos

- nombre_evento
- tipo_evento
- fecha_realizacion
- hora_inicio
- hora_fin
- lugar
- publico_objetivo (JSONField)
- programa_educativo
- responsable (FK a User)
- descripcion
- cupo_maximo

---

## Desarrollador

**Adolfo Huerta Martínez - 202262175**

- GitHub: [@AdolfoHMtz](https://github.com/AdolfoHMtz)
- Repositorio: [Proyecto-Desarrollo-de-Aplicaciones-Moviles](https://github.com/AdolfoHMtz/Proyecto-Desarrollo-de-Aplicaciones-Moviles)

---
