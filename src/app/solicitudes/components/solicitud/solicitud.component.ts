import { BlockScrollStrategy } from '@angular/cdk/overlay';
import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSesiónActiva } from 'src/app/core/state/sesion.selectors';
import { $regimenFiscal } from 'src/app/models/regimenFiscal';
import { Sesión } from 'src/app/models/sesión';
import { SolicitudInfo } from 'src/app/models/solicitudInfo';
import { $tipoMovimiento } from 'src/app/models/tipoMovimiento';
import { $tipoPago, $tipoPagoOrden } from 'src/app/models/tipoPago';
import { TipoUsuario, Usuario } from 'src/app/models/usuario';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
})
export class SolicitudComponent implements OnInit {
  public usuario!: Usuario;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public enEdicion: boolean = true;
  public mostrarBusqueda: boolean = false;
  public mostrarDatosRegistrados: boolean = false;
  public mostrarDatosSolicitud: boolean = false;
  public mostrarBotonesAsignacion: boolean = false;
  public existeDatosModificados: boolean = true;
  public tipoDePago = $tipoPago;
  public tipoDePagoOrden = $tipoPagoOrden;
  public tipoMovimiento = $tipoMovimiento;
  public regimenFiscal = $regimenFiscal;
  public solicitud!: SolicitudInfo;

  constructor(private router: Router, private storeSesión: Store<Sesión>) {}

  public abrirUnidadNE() {}

  public getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Ingresa un correo valido';
    }

    return this.email.hasError('email') ? 'No es un correo valido' : '';
  }

  public eliminarSolicitud() {
    Swal.fire({
      title: '¡La solicitud será eliminada!',
      text: '¿Está seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminar!',
      cancelButtonText: '¡No, Cancela!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Eliminado!', 'Tu solicitud ha sido eliminada', 'success');

        this.router.navigate(['solicitudes/solicitudes']);
      }
    });
  }

  public desasignarSolicitud() {
    Swal.fire({
      title: '¡La solicitud se desasignara!',
      text: '¿Está seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Desasignar!',
      cancelButtonText: '¡No, Cancela!',
    }).then(async (result) => {
      if (result.isConfirmed)
        Swal.fire({
          title: 'Elige una opción o escribe el motivo',
          icon: 'question',
          html:
            '<div><form><p><input type="radio" value="o1" name="option1">Opcion 1</p>' +
            '<p><input type="radio" value="o2" name="option1">Opcion 2</p>' +
            '<p><input type="radio" value="o3" name="option1">Opcion 3 </p></form></div>' +
            '<textarea name="" id="" cols="40" rows="3" placeholder="Escribe el motivo"></textarea>',
          focusConfirm: false,
          preConfirm: () => {
            return [
              Swal.fire({
                icon: 'success',
                title: 'La solicitud se te ha desasignado',
              }),
            ];
          },
        });
    });
  }

  public autorizar() {
    let respuesta: string = 'Oops...';
    let iconoRespuesta: SweetAlertIcon = 'error';
    let errorAlGuardar: string | undefined = undefined;
    let autorizado: string | undefined = undefined;
    let autorizadoExitoso: string | undefined = undefined;

    if (
      !this.usuario ||
      (this.usuario.tipoUsuario != TipoUsuario.soporte &&
        this.usuario.tipoUsuario != TipoUsuario.administrador &&
        this.usuario.tipoUsuario != TipoUsuario.top)
    ) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'error',
        title: 'No autorizado',
        text: 'No tienes permisos para realizar esta operación',
      });
      return;
    }

    autorizado = 'La solicitud se ha autorizado';

    if (autorizado) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: 'La solicitud se ha autorizado correctamente',
      });

      this.router.navigate(['solicitudes/solicitudes']);
    }

    // errorAlGuardar = 'Error en el servidor';

    // if (errorAlGuardar) {
    //   respuesta = 'Error al guardar: ' + errorAlGuardar;
    //   iconoRespuesta = 'error';
    // }

    // Swal.fire({
    //   icon: 'error',
    //   title: 'Oops...',
    //   text: 'Parece que algo anda mal',
    // });

    // if (errorAlGuardar) return;

    // this.router.navigate(['solicitudes/solicitudes']);
  }

  public asignarSolicitud() {
    Swal.fire({
      title: '¡La solicitud se te asignara!',
      text: '¿Está Seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Asignar!',
      cancelButtonText: '¡No, Cancela!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'La solicitud se te asigno correctamente',
          icon: 'success',
        });
      }
    });
  }

  public validarDatos() {
    let respuesta: string = 'Datos validados correctamente';
    let iconoRespuesta: SweetAlertIcon = 'success';
    let errorAlGuardar: string | undefined = undefined;

    // errorAlGuardar = "Error en el servidor";

    if (errorAlGuardar) {
      respuesta = 'Error al guardar: ' + errorAlGuardar;
      iconoRespuesta = 'error';
    }

    Swal.fire({
      position: 'top-end',
      icon: iconoRespuesta,
      title: respuesta,
      showConfirmButton: false,
      timer: 1500,
    });

    if (errorAlGuardar) return;

    this.existeDatosModificados = false;
    this.mostrarDatosRegistrados = false;
  }

  valueAscOrder = (
    a: KeyValue<string, string>,
    b: KeyValue<string, string>
  ): number => {
    return this.tipoDePagoOrden[a.key] - this.tipoDePagoOrden[b.key];
  };

  ngOnInit(): void {
    this.storeSesión.select(selectSesiónActiva).subscribe((sesión: Sesión) => {
      if (!sesión.activa || !sesión.usuario) {
        this.router.navigate(['noAutorizado']);
        return;
      }
      this.usuario = sesión.usuario;
    });

    this.solicitud = {
      id: 0,
      cliente: '',
      appId: '',
      version: 1,
      ace_ClientId: 0,
      fechaRegistro: new Date(),
      fechaRegistroTxt: '',
      tipoMovimiento: 'DE',
      solicitud: '',
      numHDD: '',
      plataforma: '',
      dato1: '',
      dato2: '',
      datoFecha: new Date(),
      datoFechaTxt: '',
      observaciones: '',
      pagoTipo: '',
      pagoFolio: '',
      pagoFecha: new Date(),
      pagoFechaTxt: '',
      pagoImporte: 0,
      asignadoA: '',
      pagoCantidadFoliosAdd: 0,
      appNombre: '',
      correoCliente: '',
      usuarioAsignado: '',
      numHDDSrv: '',
      mensajes: [],
      userId: '',
      facturarAId: 0,
      clienteHistorialId: 0,
      ultimaModificacion: new Date(),
      ultimaModificacionTxt: '',
      cambiosDespuesDeAsignado: false,
      solicitudDispositivo: true,
    };

    //this.solicitud.userId = 'carlos@asesorcontable';
    this.solicitud.appNombre = 'NomiExpress';
    this.solicitud.version = 3.2;
    this.solicitud.tipoMovimiento = 'MON';

    // this.mostrarDatosRegistrados = this.existeDatosModificados;
    // this.mostrarDatosSolicitud = this.existeDatosModificados;
  }
}
