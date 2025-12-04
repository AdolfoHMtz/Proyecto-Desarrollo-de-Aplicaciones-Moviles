import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  // Variables y métodos del componente
  public name_user: string = "";
  public rol: string = "";
  public lista_admins: any[] = [];

  constructor(
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Lógica de inicialización aquí
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Obtenemos los administradores
    this.obtenerAdmins();
  }

  //Obtener lista de usuarios
  public obtenerAdmins() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {
        this.lista_admins = response;
        console.log("Lista users: ", this.lista_admins);
      }, (error) => {
        alert("No se pudo obtener la lista de administradores");
      }
    );
  }

  public goEditar(idUser: number) {
    // Solo admin puede editar admins
    if (this.rol === 'administrador') {
      this.router.navigate(["registro-usuarios/administrador/"+idUser]);
    } else {
      alert("No tienes permisos para editar administradores.");
    }
  }

  public delete(idUser: number) {
    // Solo admin puede eliminar admins
    if (this.rol === 'administrador') {
      // Validar que no se elimine a sí mismo
      const userId = Number(this.facadeService.getUserId());
      if (userId === idUser) {
        alert("No puedes eliminarte a ti mismo.");
        return;
      }

      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'administrador'},
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          console.log("Administrador eliminado");
          alert("Administrador eliminado correctamente.");
          this.obtenerAdmins();
        }else{
          alert("Administrador no se ha podido eliminar.");
          console.log("No se eliminó el administrador");
        }
      });
    } else {
      alert("No tienes permisos para eliminar administradores.");
    }
  }

}
