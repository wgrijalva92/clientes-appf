import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public titulo: string = 'Crear Cliente';
  public cliente: Cliente = new Cliente();
  public regiones: Region[] = [];

  public errores: string[] = [];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }
    ngOnInit(): void {
      this.getCliente();
      this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  public save(): void{
    this.clienteService.save(this.cliente)
    .subscribe(cliente => {
      this.router.navigate(['/clientes'])
      Swal.fire({
        icon: 'success',
        title: 'Nuevo Cliente',
        text: `Cliente ${cliente.cliNombre} guardado correctamente`,
        showConfirmButton: true
      })
    });
  }

  public getCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(
          cliente => this.cliente = cliente
        )
      }
    })
  }

  public update():void{
    this.clienteService.update(this.cliente).
    subscribe(json => {
      this.router.navigate(['/clientes'])
      Swal.fire({
        icon: 'success',
        title: 'Cliente Actualizado',
        text: `${json.cliente.cliNombre}: ${json.mensaje}`,
        showConfirmButton: true
      })
    })
  }

  public compararRegion(obj1: Region, obj2: Region){
    if (obj1 === undefined && obj2 === undefined){
      return true;
    }
    return obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined ? false : obj1.regId === obj2.regId;
  }

}
