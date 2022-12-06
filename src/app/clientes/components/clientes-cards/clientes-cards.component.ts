import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { selectSesiónActiva } from 'src/app/core/state/sesion.selectors';
import { Cliente } from 'src/app/models/cliente';
import { ClienteState } from 'src/app/models/cliente.state';
import { Sesión } from 'src/app/models/sesión';
import { TipoUsuario, Usuario } from 'src/app/models/usuario';
import { clientesInicializar, clientesEliminar, clientesSeleccionar } from '../../state/clientes.actions';
import { selectClientes } from '../../state/clientes.selectors';

@Component({
  selector: 'app-clientes-cards',
  templateUrl: './clientes-cards.component.html',
  styleUrls: ['./clientes-cards.component.scss']
})
export class ClientesCardsComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public usuario!: Usuario;
  public clientes!: Cliente[];
  // public esAdmin: boolean = false;
  // public sesionSubscription!: Subscription;
  // public sesion$: Observable<Sesión>;
  // public sesion: Sesión = { activa: false, usuario: undefined };  
  // public clientes$!: Observable<Cliente[]>;
  // public clientesSubscribe!: Subscription;
  public filtro: string = "";
  public error: Error | undefined;
  // public Estados = Estados;

  constructor(
    // private clientesService: ClientesService,
    // private sesionServicio: SesiónService,
    private dialog: MatDialog,
    private router: Router,
    private storeClientes: Store<ClienteState>,
    private storeSesión: Store<Sesión>
  ) {
    // this.clientes$ = this.clientesService.obtenerClientesBehaviorSubject();
    // this.storeClientes.dispatch(clientesInicializar());
    // this.sesion$ = this.sesionServicio.obtenerSesión().pipe(
    //   map((sesion: Sesión) => this.sesion = sesion)
    // );
  }

  // @Output()
  // public clienteEditar = new EventEmitter<number>();
  public editarCliente(clienteId: number) {
    // if (this.href == '/clientes') {
    //   console.log(`Solicitud de modificación del cliente por output: ${clienteId}`);
    //   this.clienteEditar.emit(clienteId);
    //   return;
    // }
    // console.log(`Solicitud de modificación del cliente por ruta: ${clienteId}`);
    // this.clientesService.seleccionarClienteActual(clienteId);
    if (this.usuario.tipoUsuario != TipoUsuario.administrador && this.usuario.tipoUsuario != TipoUsuario.top) { //if (!this.esAdmin) {
      alert('Procedimiento solo para administradores');
      return;
    }
    this.storeClientes.dispatch(clientesSeleccionar( {seleccionado: clienteId} ));
    this.router.navigate(['clientes', 'cliente']);
  }

  // @Output()
  // public detalleClientes = new EventEmitter<number>();
  public detalleCliente(clienteId: number) {
    // if (this.href == '/clientes') {
    //   console.log(`Solicitud de detalle del cliente por output: ${clienteId}`);
    //   this.detalleClientes.emit(clienteId);
    //   return;
    // }
    // console.log(`Solicitud de detalle del cliente por ruta: ${clienteId}`);
    // this.clientesService.seleccionarClienteActual(clienteId);
    this.storeClientes.dispatch(clientesSeleccionar( {seleccionado: clienteId} ));
    this.router.navigate(['clientes', 'detalle']);
  }

  public eliminarClienteClick(clienteAEliminar: number, nombreCliente: string) {
    if (this.usuario.tipoUsuario != TipoUsuario.administrador && this.usuario.tipoUsuario != TipoUsuario.top) { //if (!this.esAdmin) {
      alert('Procedimiento solo para administradores');
      return;
    }
    let clienteActual: Cliente = {id: clienteAEliminar, cliente: nombreCliente, rfc: '', regimenFiscal: '', cp: '', correo: '', comentarios: '', idNEWeb: '', responsable: ''};// if (!this.esAdmin) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: clienteActual,
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed ${result}`);
      if (clienteActual.cliente != result) return;
      this.storeClientes.dispatch(clientesEliminar({ cliente: clienteActual }));
    });
    
    // this.clientesSubscribe = this.clientesService.eliminarClienteHttp(clienteId).subscribe(
    //   (resultado: Cliente) => {
    //     this.cargarClientes();
    //   }, (err: Error) => {
    //     console.error(err);
    //     this.error = err;
    //     setTimeout(() => {
    //       this.error = undefined;
    //     }, 15000);
    //   }, () => {
    //     this.clientesSubscribe.unsubscribe;
    //   }
    // );
  }

  private cargarClientes() {
    this.storeClientes.select(selectClientes).subscribe((clientes: Cliente[]) => {
      this.cargando = false;
      if (this.filtro) {
        this.clientes = clientes.filter((cliente: Cliente) => cliente.cliente.toLowerCase().includes(this.filtro))
        return;
      }
      this.clientes = clientes;
    });
    // this.clientesService.obtenerClientesHttp().subscribe({
    //   next: (clientes: Cliente[]) => {
    //     this.storeClientes.dispatch(clientesCargar({ clientes }))
    //   },
    //   error: (error: any) => {
    //     this.storeClientes.dispatch(clientesCargarError(error));
    //   }
    // });    
  }

  public aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtro = valorFiltro;
    this.cargarClientes();
    // this.clientes$.pipe(
    //   map((clientes: Cliente[]) => clientes.filter((cliente: Cliente) => cliente.cliente.toLowerCase().includes(valorFiltro)))
    // ).subscribe((clientes) => {
    //   console.log("filtro aplicado a rxjs cards");
    // });
  }

  // private href: string = "";
  ngOnInit(): void {
    this.storeSesión.select(selectSesiónActiva).subscribe((sesión: Sesión) => {
      if (!sesión.activa || !sesión.usuario) {
        this.router.navigate(['noAutorizado']);
        return;
      }
      this.usuario = sesión.usuario;
    });
    this.cargarClientes();

    // this.esAdmin = false;
    // this.sesionSubscription = this.sesionServicio.obtenerSesión().subscribe(
    //   (sesion: Sesión) => {
    //     console.log('Sesión cargada');
    //     this.sesion = sesion;
    //     this.esAdmin = this.sesion && this.sesion.activa && (this.sesion.usuario?.tipoUsuario == TipoUsuario.top || this.sesion.usuario?.tipoUsuario == TipoUsuario.administrador);
    //   }, (err: Error) => {
    //     console.error(err);
    //   }, () => {
    //     this.sesionSubscription.unsubscribe;
    //   }
    // );

    // this.clientes$ = this.storeClientes.select(selectClientes);
    // this.storeClientes.select(selectEstadoCliente).pipe(
    //   map((estado: Estados) => {
    //     this.estadoCliente = estado;
    //     if (estado == Estados.datosCargados) {
    //       return;
    //     }
    //     if (estado == Estados.cargando) {
    //       setTimeout(() => {
    //         this.ngOnInit();
    //       }, 1500);
    //       return;
    //     }
    //     this.cargarClientes();
    //   })
    // ).subscribe(() => {
    //   return;
    //   console.log("Cargar estado del cliente");
    // });
  }

  ngOnDestroy(): void {
    // if (this.clientesSubscribe) this.clientesSubscribe.unsubscribe();
    // if (this.sesionSubscription) this.sesionSubscription.unsubscribe();
  }

}
