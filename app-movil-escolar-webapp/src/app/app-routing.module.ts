import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { RegistroEventosComponent } from './partials/registro-eventos/registro-eventos.component';
import { EventosScreenComponent } from './screens/eventos-screen/eventos-screen.component';


const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginScreenComponent },
      { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent },
      { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'home', component: HomeScreenComponent },
      { path: 'administrador', component: AdminScreenComponent },
      { path: 'alumnos', component: AlumnosScreenComponent },
      { path: 'maestros', component: MaestrosScreenComponent },
      { path: 'graficas', component: GraficasScreenComponent },
      { path: 'eventos', component: EventosScreenComponent },
      { path: 'registro-eventos', component: RegistroEventosComponent },
      { path: 'registro-eventos/:id', component: RegistroEventosComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
