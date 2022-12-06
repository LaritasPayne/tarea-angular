import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit, OnDestroy {
  public usuario!: Usuario;
  // public esAdmin: boolean = false;
  // public sesionSubscription!: Subscription;
  // public sesion$: Observable<Sesion>;
  // public sesion: Sesion = { activa: false, usuario: undefined };
  // public clientes$!: Observable<Cliente[]>;
  // public cargando$!: Observable<boolean>;
  // public clientesSubscribe!: Subscription;
  public filtro: string = "";
  public error: Error | undefined;
  // private inicializado: boolean = false;

  // @Input()
  // public clientesOrigen: Clientes[] = [];
  // public clientes: Cliente[] = [];

  public columnas: string[] = ['id', 'nombre', 'rfc', 'regimenFiscal', 'cp', 'correo', 'responsable', 'comentarios', 'tieneUnidad', 'acciones'];
  public dataSource: MatTableDataSource<Cliente> = new MatTableDataSource<Cliente>([]);
  public clickedRows: Set<Cliente> = new Set<Cliente>();
  // private merge$!: Observable<any>;
  // private href: string = "";
  // private timer: any | undefined = undefined;

  // @Output()
  // public clienteEditar = new EventEmitter<number>();

  constructor(
    private dialog: MatDialog,
    // private clientesService: ClientesService,
    // private sesionServicio: SesionService,
    private router: Router,
    private storeClientes: Store<ClienteState>,
    private storeSesión: Store<Sesión>
  ) {
        // clientesService.obtenerClientesAsync().then(
        //   (clientes: Cliente[]) => {
        //     this.clientes = clientes;
        //     console.log(`Clientes cargados Promesa: ${this.clientes}`);
        //     // console.log(`Clientes originales por Input: ${this.clientesOrigen}`);
        //   }).catch((error: { codigo: number, mensaje: string }) => {
        //     console.log(`Error: código ${error.codigo} -> ${error.mensaje}. Clientes: ${this.clientes}`);
        //     // console.log(`Clientes originales por Input: ${this.clientesOrigen}`);
        //   });
    
        // this.clientesSubscription = clientesService.obtenerClientesObservable().subscribe({
        //   next: (clientes: Cliente[]) => {
        //     this.clientes = clientes;
        //     console.log(`Clientes cargados Observable: ${this.clientes}`);
        //   },
        //   error: (error) => {
        //     console.error(error);
        //   }
        // });
    // this.sesion$ = this.sesionServicio.obtenerSesion().pipe(
    //   map((sesion: Sesión) => this.sesion = sesion)
    // );
  }

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
    this.storeClientes.dispatch(clientesSeleccionar( {seleccionado: clienteId}));
    this.router.navigate(['clientes', 'cliente']);
  }

  // @Output()
  // public detalleClientes = new EventEmitter<number>();
  public detalleCliente(clienteId: number) {
    // console.log(`Solicitud de detalle del cliente por ruta: ${clienteId}`);
    // this.clientesService.seleccionarClienteActual(clienteId);
    this.storeClientes.dispatch(clientesSeleccionar( {seleccionado: clienteId} ));
    this.router.navigate(['clientes', 'detalle']);
  }

  // @Output()
  // public eliminarCliente = new EventEmitter<number>();
  public eliminarClienteClick(clienteAEliminar: number, nombreCliente: string) {
    if (!this.usuario) {
      alert('Procedimiento solo para administradores registrados');
      return;
    }
    if (this.usuario.tipoUsuario != TipoUsuario.administrador && this.usuario.tipoUsuario != TipoUsuario.top) { //if (!this.esAdmin) {
      alert('Procedimiento solo para administradores');
      return;
    }
    let clienteActual: Cliente = {id: clienteAEliminar, cliente: nombreCliente, rfc: '', regimenFiscal: '', cp: '', correo: '', comentarios: '', idNEWeb: '', responsable: ''};
    // let indexCliente: number = this.clientes.findIndex(x => x.id == clienteAEliminar);
    // if (indexCliente < 0) {
    //   this.dialog.open(ErrorComponent, {
    //     data: "No se puede localizar al cliente seleccionado",
    //     width: '350px'
    //   });
    //   return;
    // }
    // let clienteActual: Cliente = this.clientes[indexCliente];
    const dialogRef = this.dialog.open(DialogComponent, {
      data: clienteActual,
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed ${result}`);
      if (clienteActual.cliente != result) return;
      this.storeClientes.dispatch(clientesEliminar({ cliente: clienteActual }));
      // this.clientesSubscribe = this.clientesService.eliminarClienteHttp(clienteAEliminar).subscribe(
      //   (resultado: Cliente) => {
      //     this.storeClientes.dispatch(clientesInicializar());
      //     this.cargarClientes();
      //     console.log("datos actualizados");
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
    });
  }

  public aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    return;

    // this.dataSource.filterPredicate = function (cliente: Clientes, filtro: string) {
    //   return cliente.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase());
    // };
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private cargarClientes() {
    this.storeClientes.select(selectClientes).subscribe((clientes: Cliente[]) => {
      this.dataSource = new MatTableDataSource<Cliente>(clientes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    // this.storeClientes.select(selectEstadoCliente).pipe(
    //   map((estado: Estados) => {
    //     this.estadoCliente = estado;
    //     clearTimeout(this.timer);
    //     if (estado == Estados.cargando) {
    //       this.timer = setTimeout(() => {
    //         this.cargarClientes();
    //       }, 1500);
    //       return;
    //     }
    //     if (estado == Estados.datosCargados) {
    //       if (this.inicializado) return;
    //     } else {
    //       this.storeClientes.dispatch(loadClientes());  // se envía el mensaje de que se están cargando los datos
    //       this.clientes$ = this.clientesService.obtenerClientesHttp();
    //     }
    //     this.inicializado = true;
    //     this.clientes$.subscribe({
    //       next: (clientes: Cliente[]) => {
    //         this.storeClientes.dispatch(clientesCargarExito({ clientes }));
    //         this.clientes = clientes;
    //         this.dataSource = new MatTableDataSource<Cliente>(this.clientes);
    //         this.dataSource.paginator = this.paginator;
    //         this.dataSource.sort = this.sort;
    //       },
    //       error: (error: any) => {
    //         this.storeClientes.dispatch(clientesCargarError(error));
    //       }
    //     });
    //   })
    // ).subscribe(() => {
    //   return;
    //   console.log("Cargar estado del cliente");
    // });
  }

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
    // this.sesionSubscription = this.sesionServicio.obtenerSesion().subscribe(
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
        // this.clientes = this.clientesOrigen;
        // this.dataSource = new MatTableDataSource<Cliente>(this.clientes);
    this.clickedRows = new Set<Cliente>();
    
    // this.href = this.router.url;

    // this.inicializado = false;
    // this.clientes$ = this.storeClientes.select(selectStateCliente);
    // this.cargarClientes();

    // console.log(this.router.url);

    // of(this.clientes).subscribe((clientes) => {
    //   console.log('Desde el of', clientes);
    // });

    // from(this.clientes).subscribe((clientes) => {
    //   console.log('Desde el from', clientes);
    // });

    // // pipe  es para todos los observables
    // of(this.clientes).pipe(
    //   // filter((clientes: Clientes[]) => clientes.nombre == 'Carlos')
    //   map((clientes: Cliente[]) => clientes.filter((cliente: Cliente) => cliente.cliente == 'Carlos'))
    // ).subscribe((clientes) => {
    //   console.log('Desde el of con filtro', clientes);
    // });

    // from(this.clientes).pipe(
    //   filter((cliente: Cliente) => cliente.cliente == 'Carlos')
    // ).subscribe((clientes) => {
    //   console.log('Desde el from con filtro', clientes);
    // });

    // of(this.clientes).pipe(
    //   mergeMap(
    //     (clientes: Cliente[]) => interval(1000).pipe(map(i => i + clientes[i].cliente))
    //   )
    // ).subscribe((clientes) => {
    //   console.log('Desde el of con mergeMap', clientes);
    // });

    // this.merge$ = of(['a', 'b', 'c', 'd']).pipe(
    //   mergeMap(
    //     letras => interval(2000).pipe(
    //       map((i) => i + letras[i])
    //     )
    //   )
    // );
    // console.log(this.router.url);

    // of(this.clientes).subscribe((clientes) => {
    //   console.log('Desde el of', clientes);
    // });

    // from(this.clientes).subscribe((clientes) => {
    //   console.log('Desde el from', clientes);
    // });

    // // pipe  es para todos los observables
    // of(this.clientes).pipe(
    //   // filter((clientes: Clientes[]) => clientes.nombre == 'Carlos')
    //   map((clientes: Cliente[]) => clientes.filter((cliente: Cliente) => cliente.cliente == 'Carlos'))
    // ).subscribe((clientes) => {
    //   console.log('Desde el of con filtro', clientes);
    // });

    // from(this.clientes).pipe(
    //   filter((cliente: Cliente) => cliente.cliente == 'Carlos')
    // ).subscribe((clientes) => {
    //   console.log('Desde el from con filtro', clientes);
    // });

    // of(this.clientes).pipe(
    //   mergeMap(
    //     (clientes: Cliente[]) => interval(1000).pipe(map(i => i + clientes[i].cliente))
    //   )
    // ).subscribe((clientes) => {
    //   console.log('Desde el of con mergeMap', clientes);
    // });

    // this.merge$ = of(['a', 'b', 'c', 'd']).pipe(
    //   mergeMap(
    //     letras => interval(2000).pipe(
    //       map((i) => i + letras[i])
    //     )
    //   )
    // );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    // if (this.clientesSubscribe) this.clientesSubscribe.unsubscribe();
    // if (this.sesionSubscription) this.sesionSubscription.unsubscribe();
  }

}
