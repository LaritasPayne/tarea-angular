import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Sesión } from 'src/app/models/sesión';
import { $tipoUsuario } from 'src/app/models/usuario';
import { selectSesiónActiva } from '../../state/sesion.selectors';
import { cargarSesión } from '../../state/sesión.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // public sesionSubscription!: Subscription;
  // public sesion$: Observable<Sesión>;
  public sesion: Sesión = { activa: false, usuario: undefined };
  // public usuario: Usuario | undefined = undefined;
  public tiposUsuario = $tipoUsuario;

  constructor(
    // private sesionServicio: SesiónService
    private storeSesión: Store<Sesión>,
    private router: Router
  ) {    
    // this.sesion$ = this.sesionServicio.obtenerSesión().pipe(
    //   map((sesion: Sesión) => this.sesion = sesion)
    // );
  }

  ngOnInit(): void {
    this.storeSesión.select(selectSesiónActiva).subscribe((sesión: Sesión) => {
      this.sesion = sesión;      
    });
    // this.sesionSubscription = this.sesionServicio.obtenerSesión().subscribe(
    //   (sesion: Sesión) => {
    //     console.log('Sesión cargada');
    //     this.sesion = sesion;
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
