import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { EditarEventoModalComponent } from 'src/app/modals/editar-evento-modal/editar-evento-modal.component';

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class RegistroEventosComponent implements OnInit {

  public evento: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idEvento: number = 0;
  public listaResponsables: any[] = [];
  public listaAdministradores: any[] = [];
  public fechaMinima: Date = new Date();

  // Opc para los selects
  public tiposEvento: string[] = ['Conferencia', 'Taller', 'Seminario', 'Concurso'];
  public programasEducativos: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];

  public publicoObjetivo = {
    estudiantes: false,
    profesores: false,
    publico_general: false
  };

  public mostrarProgramaEducativo: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private eventosService: EventosAcademicosService,
    private facadeService: FacadeService,
    private maestrosService: MaestrosService,
    private administradoresService: AdministradoresService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerResponsables();

    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      console.log("ID Evento: ", this.idEvento);

      // Cargar datos del evento
      this.eventosService.obtenerEventoPorID(this.idEvento).subscribe({
        next: (response: any) => {
          this.evento = response;
          if (this.evento.publico_objetivo && this.evento.publico_objetivo.length > 0) {
            this.publicoObjetivo.estudiantes = this.evento.publico_objetivo.includes('Estudiantes');
            this.publicoObjetivo.profesores = this.evento.publico_objetivo.includes('Profesores');
            this.publicoObjetivo.publico_general = this.evento.publico_objetivo.includes('Público general');
            this.verificarProgramaEducativo();
          }

          if (this.evento.responsable && this.evento.responsable.id) {
            this.evento.responsable = this.evento.responsable.id;
          }
          if (this.evento.hora_inicio && this.evento.hora_inicio.length > 5) {
            this.evento.hora_inicio = this.evento.hora_inicio.substring(0, 5);
          }
          if (this.evento.hora_fin && this.evento.hora_fin.length > 5) {
            this.evento.hora_fin = this.evento.hora_fin.substring(0, 5);
          }
          console.log("Evento cargado: ", this.evento);
        },
        error: (error: any) => {
          console.error("Error al obtener evento: ", error);
          alert("Error al cargar los datos del evento");
          this.router.navigate(["eventos"]);
        }
      });
    } else {
      this.evento = this.eventosService.esquemaEvento();
    }
  }

  public obtenerResponsables() {
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (response: any) => {
        this.listaResponsables = response.map((maestro: any) => ({
          id: maestro.user.id,
          nombre_completo: `${maestro.user.first_name} ${maestro.user.last_name} (Maestro)`,
          tipo: 'maestro'
        }));

        this.administradoresService.obtenerListaAdmins().subscribe({
          next: (responseAdmin: any) => {
            const admins = responseAdmin.map((admin: any) => ({
              id: admin.user.id,
              nombre_completo: `${admin.user.first_name} ${admin.user.last_name} (Admin)`,
              tipo: 'administrador'
            }));
            this.listaResponsables = [...this.listaResponsables, ...admins];
            console.log("Lista de responsables: ", this.listaResponsables);
          },
          error: (error: any) => {
            console.error("Error al obtener administradores: ", error);
          }
        });
      },
      error: (error: any) => {
        console.error("Error al obtener maestros: ", error);
      }
    });
  }

  public regresar() {
    this.location.back();
  }

  public onPublicoObjetivoChange() {
    this.evento.publico_objetivo = [];
    if (this.publicoObjetivo.estudiantes) {
      this.evento.publico_objetivo.push('Estudiantes');
    }
    if (this.publicoObjetivo.profesores) {
      this.evento.publico_objetivo.push('Profesores');
    }
    if (this.publicoObjetivo.publico_general) {
      this.evento.publico_objetivo.push('Público general');
    }
    this.verificarProgramaEducativo();
  }

  public verificarProgramaEducativo() {
    this.mostrarProgramaEducativo = this.publicoObjetivo.estudiantes;
    if (!this.mostrarProgramaEducativo) {
      this.evento.programa_educativo = '';
    }
  }

  public registrar() {
    this.errors = {};

    this.errors = this.eventosService.validarEvento(this.evento, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    if (this.evento.fecha_realizacion instanceof Date) {
      const fecha = this.evento.fecha_realizacion;
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      this.evento.fecha_realizacion = `${year}-${month}-${day}`;
    }
    if (this.evento.hora_inicio && this.evento.hora_inicio.length === 5) {
      this.evento.hora_inicio = this.evento.hora_inicio + ':00';
    }
    if (this.evento.hora_fin && this.evento.hora_fin.length === 5) {
      this.evento.hora_fin = this.evento.hora_fin + ':00';
    }

    this.eventosService.registrarEvento(this.evento).subscribe({
      next: (response: any) => {
        alert('Evento registrado con éxito');
        console.log("Evento registrado", response);
        this.router.navigate(['eventos']);
      },
      error: (error: any) => {
        if (error.status === 422) {
          this.errors = error.error.errors;
        } else {
          alert('Error al registrar el evento');
        }
      }
    });
  }

  public actualizar() {
    this.errors = {};

    this.errors = this.eventosService.validarEvento(this.evento, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    if (this.evento.fecha_realizacion instanceof Date) {
      const fecha = this.evento.fecha_realizacion;
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      this.evento.fecha_realizacion = `${year}-${month}-${day}`;
    }

    if (this.evento.hora_inicio && this.evento.hora_inicio.length === 5) {
      this.evento.hora_inicio = this.evento.hora_inicio + ':00';
    }
    if (this.evento.hora_fin && this.evento.hora_fin.length === 5) {
      this.evento.hora_fin = this.evento.hora_fin + ':00';
    }

    const dialogRef = this.dialog.open(EditarEventoModalComponent, {
      width: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isEdit) {
        this.eventosService.actualizarEvento(this.evento).subscribe(
          (response) => {
            alert("Evento actualizado exitosamente");
            console.log("Evento actualizado: ", response);
            this.router.navigate(["eventos"]);
          },
          (error) => {
            alert("Error al actualizar evento");
            console.error("Error al actualizar evento: ", error);
          }
        );
      }
    });
  }

  public changeFecha(event: any) {
    const fecha = event.value;
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    this.evento.fecha_realizacion = `${year}-${month}-${day}`;
  }

  // Función para solo permitir letras y números
  public soloLetrasNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir letras (mayúsculas y minúsculas), números y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      !(charCode >= 48 && charCode <= 57) &&  // Números
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}
