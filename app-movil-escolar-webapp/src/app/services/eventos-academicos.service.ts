import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosAcademicosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaEvento() {
    return {
      'nombre_evento': '',
      'tipo_evento': '',
      'fecha_realizacion': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico_objetivo': [],
      'programa_educativo': '',
      'responsable': '',
      'descripcion': '',
      'cupo_maximo': ''
    }
  }

  public validarEvento(data: any, editar: boolean) {
    console.log("Validando evento... ", data);
    let error: any = {};

    // Validaciones
    if (!this.validatorService.required(data["nombre_evento"])) {
      error["nombre_evento"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["tipo_evento"])) {
      error["tipo_evento"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["fecha_realizacion"])) {
      error["fecha_realizacion"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = this.errorService.required;
    } else if (data["hora_inicio"] && data["hora_fin"]) {
      if (data["hora_fin"] <= data["hora_inicio"]) {
        error["hora_fin"] = "La hora de fin debe ser posterior a la hora de inicio";
      }
    }

    if (!this.validatorService.required(data["lugar"])) {
      error["lugar"] = this.errorService.required;
    }

    if (!data["publico_objetivo"] || data["publico_objetivo"].length === 0) {
      error["publico_objetivo"] = "Debe seleccionar al menos un público objetivo";
    }

    if (data["publico_objetivo"] && data["publico_objetivo"].includes('Estudiantes')) {
      if (!this.validatorService.required(data["programa_educativo"])) {
        error["programa_educativo"] = "El programa educativo es obligatorio cuando el público incluye estudiantes";
      }
    }

    if (!this.validatorService.required(data["responsable"])) {
      error["responsable"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["descripcion"])) {
      error["descripcion"] = this.errorService.required;
    } else if (!this.validatorService.max(data["descripcion"], 300)) {
      error["descripcion"] = this.errorService.max(300);
    }

    if (!this.validatorService.required(data["cupo_maximo"])) {
      error["cupo_maximo"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["cupo_maximo"])) {
      alert("El cupo máximo debe ser un número");
    } else if (data["cupo_maximo"] < 1 || data["cupo_maximo"] > 999) {
      error["cupo_maximo"] = "El cupo debe estar entre 1 y 999";
    }
    return error;
  }

  //Registrar un nuevo evento
  public registrarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.post<any>(`${environment.url_api}/eventos/`, data, { headers });
  }

  //Eliminar evento
  public eliminarEvento(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }

  //Obtener la lista de eventos
  public obtenerListaEventos(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, { headers });
  }

  // Obtener un evento por su ID
  public obtenerEventoPorID(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }

  // Actualizar un evento
  public actualizarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.put<any>(`${environment.url_api}/eventos/`, data, { headers });
  }

  public obtenerListaResponsables(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, { headers });
  }
}
