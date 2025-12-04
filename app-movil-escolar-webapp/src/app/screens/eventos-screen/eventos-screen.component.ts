import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';
import { EliminarUserModalComponent } from '../../modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_eventos: any[] = [];
  public isAdmin: boolean = false;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public facadeService: FacadeService,
    public eventosService: EventosAcademicosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.isAdmin = this.rol === 'administrador';

    if (this.isAdmin) {
      this.displayedColumns = ['nombre_evento', 'tipo_evento', 'fecha_realizacion', 'hora_inicio', 'hora_fin', 'lugar', 'responsable', 'cupo_maximo', 'editar', 'eliminar'];
    } else {
      this.displayedColumns = ['nombre_evento', 'tipo_evento', 'fecha_realizacion', 'hora_inicio', 'hora_fin', 'lugar', 'responsable', 'cupo_maximo'];
    }
    this.obtenerEventos();
  }

  //Obtener eventos
  public obtenerEventos() {
    this.eventosService.obtenerListaEventos().subscribe(
      (response) => {
        this.lista_eventos = response;
        console.log("Lista eventos: ", this.lista_eventos);

        if (this.lista_eventos.length > 0) {
          this.lista_eventos.forEach(evento => {
            if (evento.responsable_info) {
              evento.nombre_responsable = `${evento.responsable_info.first_name} ${evento.responsable_info.last_name}`;
            }
          });
          let eventosFiltrados = this.filtrarEventosPorRol(this.lista_eventos);
          console.log("Eventos filtrados por rol: ", eventosFiltrados);

          this.dataSource = new MatTableDataSource<DatosEvento>(eventosFiltrados as DatosEvento[]);
          this.dataSource.sortingDataAccessor = (item: any, property: string) => {
            switch (property) {
              case 'responsable':
                return item.nombre_responsable?.toLowerCase() || '';
              case 'nombre_evento':
                return item.nombre_evento.toLowerCase();
              default:
                return item[property];
            }
          };
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }

      }, (error) => {
        console.error("Error al obtener la lista de eventos: ", error);
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }

  // Filtrar eventos según usuario
  private filtrarEventosPorRol(eventos: any[]): any[] {
    if (this.rol === 'administrador') {
      return eventos;
    } else if (this.rol === 'maestro') {
      return eventos.filter(evento => {
        if (!evento.publico_objetivo || evento.publico_objetivo.length === 0) {
          return false;
        }
        return evento.publico_objetivo.includes('Profesores') ||
               evento.publico_objetivo.includes('Público general');
      });
    } else if (this.rol === 'alumno') {
      return eventos.filter(evento => {
        if (!evento.publico_objetivo || evento.publico_objetivo.length === 0) {
          return false;
        }
        return evento.publico_objetivo.includes('Estudiantes') ||
               evento.publico_objetivo.includes('Público general');
      });
    }
    return [];
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public goRegistrar() {
    this.router.navigate(["registro-eventos"]);
  }

  public goEditar(idEvento: number) {
    this.router.navigate(["registro-eventos/" + idEvento]);
  }

  public delete(idEvento: number) {
    if (this.isAdmin) {
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idEvento, rol: 'evento'},
        height: '288px',
        width: '328px',
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          console.log("Evento eliminado");
          alert("Evento eliminado correctamente.");
          this.obtenerEventos();
        }else{
          alert("Evento no se ha podido eliminar.");
          console.log("No se eliminó el evento");
        }
      });
    }else{
      alert("No tienes permisos para eliminar eventos.");
    }
  }

}

export interface DatosEvento {
  id: number;
  nombre_evento: string;
  tipo_evento: string;
  fecha_realizacion: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  publico_objetivo: string[];
  programa_educativo: string;
  responsable: any;
  nombre_responsable: string;
  descripcion: string;
  cupo_maximo: number;
}
