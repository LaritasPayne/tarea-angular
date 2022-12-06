import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginComponent } from 'src/app/core/components/login/login.component';
import { selectSesiónActiva } from 'src/app/core/state/sesion.selectors';
import { Sesión } from 'src/app/models/sesión';

@Component({
  selector: 'app-autenticacion-login',
  templateUrl: './autenticacion-login.component.html',
  styleUrls: ['./autenticacion-login.component.scss']
})
export class AutenticacionLoginComponent implements OnInit, OnDestroy {

  constructor(
    // private sesionServicio: SesiónService,
    private storeSesión: Store<Sesión>,
    private dialog: MatDialog,
    private router: Router
  ) {

  }

  // public sesionSubscription!: Subscription;

  ngOnInit(): void {
    this.storeSesión.select(selectSesiónActiva).subscribe((sesión: Sesión) => {
      if (!sesión.activa || !sesión.usuario) {
        const logIn = this.dialog.open(LoginComponent, {
          data: '',
          width: '350px'
        });

        logIn.afterClosed().subscribe(result => {          
          // this.sesionSubscription = this.sesionServicio.obtenerSesión().subscribe(
          //   (resultado: Sesión) => {
          //     this.router.navigate(['inicio']);
          //   }, (err: Error) => {
          //     console.error(err);
          //     this.router.navigate(['autenticacion/nuevo']);
          //   }, () => {
          //     this.sesionSubscription.unsubscribe;
          //   }
          // );
        });
        return;      
      }
    });

    // logIn.afterClosed().subscribe(result => {
    //   console.log(`LogIn cerrado en autenticacion/login, resultado: ${result}`);
    //   this.sesionSubscription = this.sesionServicio.obtenerSesión().subscribe(
    //     (resultado: Sesión) => {
    //       this.router.navigate(['inicio']);
    //     }, (err: Error) => {
    //       console.error(err);
    //       this.router.navigate(['autenticacion/nuevo']);
    //     }, () => {
    //       this.sesionSubscription.unsubscribe;
    //     }
    //   );
    // });
  }

  ngOnDestroy(): void {
    // if (this.sesionSubscription) this.sesionSubscription.unsubscribe;    
  }

}
