import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, RouterEvent, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { Sesión } from 'src/app/models/sesión';
import { SesiónService } from 'src/app/services/sesión.service';
import { TipoUsuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { asignarSesiónActiva, cargarSesión } from '../../state/sesión.actions';
import { selectSesiónActiva } from '../../state/sesion.selectors';

@Component({
  selector: 'app-menu-inicial',
  templateUrl: './menu-inicial.component.html',
  styleUrls: ['./menu-inicial.component.scss']
})
export class MenuInicialComponent implements OnInit, OnDestroy {

  // public sesionSubscription!: Subscription;
  // public sesion$: Observable<Sesión>;
  // public sesion: Sesión = { activa: false, usuario: undefined };
  public sesion!: Sesión;
  public esAdmin: boolean = false;
  public esCurso: boolean = false;
  public ruta: string = "inicio";

  constructor(
    // private sesionService: SesiónService,
    private storeSesión: Store<Sesión>,
    private readonly _router: Router
  ) {
    // this.sesion$ = this.sesionService.obtenerSesión().pipe(
    //   map((sesion: Sesión) => this.sesion = sesion)
    // );
    this.storeSesión.dispatch(cargarSesión());

    _router.events.pipe(
      filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      this.obtenerRuta(_router.url);
    });
  }

  private obtenerRuta(url: string) {
    if (!url) {
      this.ruta = "inicio";
      return;
    }
    let rutas: string[] = url.split('/');
    if (rutas.length < 2 || !rutas[1]) {
      this.ruta = "inicio";
      return;
    }
    this.ruta = rutas[1];
  }

  public cerrarSesion() {
    this.sesion.activa = false;
    this.sesion.usuario = undefined;
    this.esAdmin = false;
    this.storeSesión.dispatch(asignarSesiónActiva( { sesión: this.sesion }));
    // let sesion: Sesión = {
    //   activa: false,
    //   usuario: undefined
    // }    
    // this.sesionService.ponerSesión(sesion);
    // if (this.ruta == "inicio") {
    //   this._router.navigate(['autenticacion/login']);
    //   return;
    // }
    // this._router.navigate(['inicio']);
  }


  ngOnInit(): void {
    this.esCurso = environment.curso;
    this.obtenerRuta(this._router.url);
    this.storeSesión.select(selectSesiónActiva).subscribe((sesión: Sesión) => {
      this.sesion = sesión;
      if (!sesión.activa || !sesión.usuario) {
        this.esAdmin = false;
        this._router.navigate(['autenticacion/login']);
        return;
      }
      this.esAdmin = this.sesion.usuario != undefined && (this.sesion.usuario.tipoUsuario == TipoUsuario.administrador || this.sesion.usuario.tipoUsuario == TipoUsuario.top);
      this._router.navigate(['inicio']);
    });

    // this.sesionSubscription = this.sesionService.obtenerSesión().subscribe(
    //   (sesion: Sesión) => {
    //     console.log('Sesión cargada');
    //     this.sesion = sesion;
    //     this.esAdmin = sesion.usuario?.tipoUsuario == TipoUsuario.administrador || sesion.usuario?.tipoUsuario == TipoUsuario.top;
    //   }, (err: Error) => {
    //     console.error(err);
    //   }, () => {
    //     this.sesionSubscription.unsubscribe;
    //   }
    // );
  }

  ngOnDestroy(): void {
    // if (this.sesionSubscription) this.sesionSubscription.unsubscribe;
  }

}
