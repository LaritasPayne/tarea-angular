import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSesiónActiva } from 'src/app/core/state/sesion.selectors';
import { Cliente } from 'src/app/models/cliente';
import { ClienteState } from 'src/app/models/cliente.state';
import { Sesión } from 'src/app/models/sesión';
import { TipoUsuario, Usuario } from 'src/app/models/usuario';
import { clientesAgregar, clientesInicializar, clientesModificar } from '../../state/clientes.actions';
import { obtenerCliente } from '../../state/clientes.selectors';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy {
  // public esAdmin: boolean = false;
  // public sesionSubscription!: Subscription;
  // public sesion$: Observable<Sesión>;
  // public sesion: Sesión = { activa: false, usuario: undefined };
  public cliente: Cliente | undefined;
  public usuario!: Usuario;
  // public clienteSubscribe!: Subscription;
  public nuevoCliente: boolean = false;
  public error: Error | undefined;

  public formularioReactivo: FormGroup;

  public editando: boolean = false;
  public TipoUsuario = TipoUsuario;

  constructor(
    private formBuilder: FormBuilder,
    // private sesionServicio: SesiónService,
    // private clientesService: ClientesService
    private router: Router,
    private storeClientes: Store<ClienteState>,
    private storeSesión: Store<Sesión>
  ) {
    this.formularioReactivo = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z ]*')]),
      rfc: new FormControl('', [Validators.required, Validators.minLength(13), Validators.pattern(/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/)])
    });
    // this.sesion$ = this.sesionServicio.obtenerSesión().pipe(
    //   map((sesion: Sesión) => this.sesion = sesion)
    // );
  }

  private cargarCliente() {
    this.formularioReactivo.patchValue({
      id: this.cliente?.id,
      nombre: this.cliente?.cliente,
      rfc: this.cliente?.rfc
    });
    this.editando = false;
  }

  submitForm(): void {
    console.log(this.formularioReactivo.value);
    this.error = undefined;
    if (!this.formularioReactivo) return;
    if (!this.cliente) this.cliente = { id: 0, cliente: '', correo: '', rfc: '', regimenFiscal: '', cp: '', responsable: '', comentarios: '', idNEWeb: '' };
    let nombreCliente = this.formularioReactivo.get('nombre')?.value;
    let rfcCliente = this.formularioReactivo.get('rfc')?.value;

    let cliente: Cliente = { id: this.cliente.id, cliente: nombreCliente, correo: this.cliente.correo, rfc: rfcCliente, regimenFiscal: this.cliente.regimenFiscal,
      cp: this.cliente.cp, responsable: this.cliente.responsable, comentarios: this.cliente.comentarios, idNEWeb: this.cliente.idNEWeb };

    if (cliente.id == 0) {
      this.storeClientes.dispatch(clientesAgregar({ cliente: cliente }));
      this.router.navigate(['clientes/cards']);
      // this.clienteSubscribe = this.clientesService.agregarClienteHttp(this.cliente).subscribe(
      //   (resultado: Cliente) => {
      //     this.cliente = resultado;
      //     this.cargarCliente();
      //   }, (err: Error) => {
      //     console.error(err);
      //     this.error = err;
      //     setTimeout(() => {
      //       this.error = undefined;
      //     }, 15000);
      //   }, () => {
      //     this.clienteSubscribe.unsubscribe;
      //   }
      // );
      return;
    }

    if (!this.usuario || (this.usuario.tipoUsuario != TipoUsuario.administrador && this.usuario.tipoUsuario != TipoUsuario.top)) {
    // if (!this.esAdmin) {
      alert('Procedimiento solo para administradores');
      return;
    }

    this.storeClientes.dispatch(clientesModificar({ cliente: cliente }));
    // this.cargarCliente();

    // this.clienteSubscribe = this.clientesService.modificarClienteHttp(this.cliente).subscribe(
    //   (resultado: Cliente) => {
    //     this.cliente = resultado;
    //     this.cargarCliente();
    //   }, (err: Error) => {
    //     console.error(err);
    //     this.error = err;
    //     setTimeout(() => {
    //       this.error = undefined;
    //     }, 15000);
    //   }, () => {
    //     this.clienteSubscribe.unsubscribe;
    //   }
    // );
  }

  

  esValido(campo: string): boolean {
    if (!this.editando) return false;
    if (!this.formularioReactivo.get(campo)?.touched) return false;
    return this.formularioReactivo.get(campo)?.valid || false;
  }

  esRequerido(campo: string): boolean {
    if (!this.editando) return false;
    if (!this.formularioReactivo.get(campo)?.touched) return false;
    return this.formularioReactivo.get(campo)?.errors?.['required'] || false;
  }

  faltaLongitud(campo: string): boolean {
    if (!this.editando) return false;
    if (!this.formularioReactivo.get(campo)?.touched) return false;
    return this.formularioReactivo.get(campo)?.errors?.['minlength'] || false;
  }

  patronCorrecto(campo: string): boolean {
    if (!this.editando) return false;
    if (!this.formularioReactivo.get(campo)?.touched) return false;
    return this.formularioReactivo.get(campo)?.errors?.['pattern'] || false;
  }

  agregarEmpleado() {
    this.nuevoCliente = true;
    this.formularioReactivo.reset();
    this.cliente = { id: 0, cliente: '', correo: '', rfc: '', regimenFiscal: '', cp: '', responsable: '', comentarios: '', idNEWeb: '' };
    this.formularioReactivo.patchValue({
      id: this.cliente.id,
      nombre: this.cliente.cliente,
      rfc: this.cliente.rfc
    });
    this.editando = true;
  }

  cargarDatosOriginales() {
    this.formularioReactivo.reset();
    this.storeClientes.select(obtenerCliente).subscribe((cliente: Cliente) => {
      if (!cliente) {
        this.editando = false;
        return;
      }
      this.cliente = cliente;      
      this.cargarCliente();
      this.editando = this.cliente.id == 0;
    });
    // this.clienteSubscribe = this.clientesService.obtenerClienteHttp(0).subscribe(
    //   (resultado: Cliente) => {
    //     this.cliente = resultado;
    //     if (!this.cliente) this.cliente = { id: 0, cliente: '', correo: '', rfc: '', regimenFiscal: '', cp: '', responsable: '', comentarios: '', idNEWeb: '' };
    //     this.cargarCliente();
    //     this.editando = this.cliente.id == 0;
    //   }, (err: Error) => {
    //     console.error(err);
    //     this.error = err;
    //     setTimeout(() => {
    //       this.error = undefined;
    //     }, 15000);
    //   }, () => {
    //     this.clienteSubscribe.unsubscribe;
    //   }
    // );
  }  

  ngOnInit(): void {
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

    this.storeSesión.select(selectSesiónActiva).subscribe((sesión: Sesión) => {
      if (!sesión.activa || !sesión.usuario) {
        this.router.navigate(['noAutorizado']);
        return;
      }
      this.usuario = sesión.usuario;
    });

    this.nuevoCliente = false;
    this.cargarDatosOriginales();    
  }

  ngOnDestroy(): void {
    // if (this.clienteSubscribe) this.clienteSubscribe.unsubscribe();
    // if (this.sesionSubscription) this.sesionSubscription.unsubscribe();
  }
}
