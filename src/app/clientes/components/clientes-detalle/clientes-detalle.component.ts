import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Cliente } from 'src/app/models/cliente';
import { ClienteState } from 'src/app/models/cliente.state';
import { clientesInicializar } from '../../state/clientes.actions';
import { obtenerCliente } from '../../state/clientes.selectors';

@Component({
  selector: 'app-clientes-detalle',
  templateUrl: './clientes-detalle.component.html',
  styleUrls: ['./clientes-detalle.component.scss']
})
export class ClientesDetalleComponent implements OnInit, OnDestroy {

  public cliente: Cliente | undefined = undefined;
  // public clienteSubscribe!: Subscription;
  public error: Error | undefined;

  constructor(
    // private clientesService: ClientesService
    private storeClientes: Store<ClienteState>
  ) { }

  // private cargarDatosOriginales() {
  //   this.clienteSubscribe = this.clientesService.obtenerClienteHttp(0).subscribe(
  //     (resultado: Cliente) => {
  //       this.cliente = resultado;
  //       if (!this.cliente) this.cliente = { id: 0, cliente: '', correo: '', rfc: '', regimenFiscal: '', cp: '', responsable: '', comentarios: '', idNEWeb: '' };
  //     }, (err: Error) => {
  //       console.error(err);
  //       this.error = err;
  //       setTimeout(() => {
  //         this.error = undefined;
  //       }, 15000);
  //     }, () => {
  //       this.clienteSubscribe.unsubscribe;
  //     }
  //   );
  // }

  ngOnInit(): void {
    this.storeClientes.select(obtenerCliente).subscribe((cliente: Cliente) => {      
      this.cliente = cliente;
    });
    
    // this.cargarDatosOriginales();
  }

  ngOnDestroy(): void {
    // if (this.clienteSubscribe) this.clienteSubscribe.unsubscribe();
  }

}
