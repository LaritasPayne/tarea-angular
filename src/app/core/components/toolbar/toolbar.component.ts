import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event, RouterEvent, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { aceSoporte_version } from '../../ace_datos';
import { Sesión } from 'src/app/models/sesión';
import { SesiónService } from 'src/app/services/sesión.service';
import { Observable, Subscription } from 'rxjs';
import { $tipoUsuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  public sesionSubscription!: Subscription;
  public sesion$: Observable<Sesión>;
  public sesion: Sesión = { activa: false, usuario: undefined };
  public tiposUsuario = $tipoUsuario;

  public ruta: string = "inicio";
  public aceSoporte_version = aceSoporte_version;

  constructor(
    private sesionService: SesiónService,
    private dialog: MatDialog,
    private readonly _router: Router
  ) {
    this.sesion$ = this.sesionService.obtenerSesión().pipe(
      map((sesion: Sesión) => this.sesion = sesion)
    );

    _router.events.pipe(
      filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      this.obtenerRuta(_router.url);
    });

  }

  public onClickRuta() {
    this._router.navigate([this.ruta]);
  }

  public cerrarSesion() {
    let sesion: Sesión = {
      activa: false,
      usuario: undefined
    }
    this.sesionService.ponerSesión(sesion);
    if (this.ruta == "inicio") {
      this._router.navigate(['autenticacion/login']);
      return;
    }
    this._router.navigate(['inicio']);
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

  ngOnInit(): void {
    this.obtenerRuta(this._router.url);
    this.sesionSubscription = this.sesionService.obtenerSesión().subscribe(
      (sesion: Sesión) => {
        console.log('Sesión cargada');
        this.sesion = sesion;
      }, (err: Error) => {
        console.error(err);
      }, () => {
        this.sesionSubscription.unsubscribe;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.sesionSubscription) this.sesionSubscription.unsubscribe;
  }

}
