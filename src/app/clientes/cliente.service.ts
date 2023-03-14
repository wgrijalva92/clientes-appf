import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
import { formatDate, registerLocaleData } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeader = new HttpHeaders({'Content-type':'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

getRegiones(): Observable<Region[]>{
  return this.http.get<Region[]>(this.urlEndPoint+"/regiones");
}

  getClientes(page:number): Observable<any>{
    return this.http.get(this.urlEndPoint +'/page/'+page).pipe(
      map((response : any ) => {
        (response.content as Cliente[]).map(cliente => {
          
          cliente.cliNombre = cliente.cliNombre.toUpperCase();
          cliente.fecCrea = formatDate(cliente.fecCrea,'EEEE dd/MM/yyyy','es');
          return cliente;
        });
        return response;
      })
    );
  }

  save(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente,{headers: this.httpHeader}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status==400){
          console.log("error desde service: " + e.status);
          return throwError(() => new Error(e));
        }
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => new Error(e));
      })
    )
  }

  update(cliente: Cliente) : Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.cliId}`, cliente, {headers: this.httpHeader}).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(() => new Error(e));
        }
        console.error(e.error.mensaje)
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeader}).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    );
  }
}
