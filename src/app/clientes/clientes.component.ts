import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  paginador: any;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe(params => {
      let page:number = +params.get('page')!;
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador  = response;
        }
      );
    })
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Está seguro?',
      text: `Segur@ que desea eliminar el cliente ${cliente.cliNombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.cliId).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Eliminado!',
              'Cliente eliminado correctamente',
              'success'
            )
          }
        )
      }
    })
  }

}
