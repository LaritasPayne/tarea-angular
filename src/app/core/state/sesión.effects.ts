import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Session } from 'protractor';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { Sesión } from 'src/app/models/sesión';
import { Usuario } from 'src/app/models/usuario';
import { SesiónService } from 'src/app/services/sesión.service';
import * as SesiónAcciones from  './sesión.actions';

@Injectable()
export class SesiónEffects {

    constructor(
        private actions$: Actions,
        private sesiónServicio: SesiónService
    ) { }

    asignarSesión$ = createEffect(
        () => { return this.actions$.pipe(
            ofType(SesiónAcciones.asignarSesiónActiva),
            concatMap(( datosSesión ) => {
                // let sesión: Sesión = {
                //     activa: !(!datosSesión.usuarioActivo),
                //     usuario: datosSesión.usuarioActivo
                // }
                return this.sesiónServicio.ponerSesión( datosSesión.sesión ).pipe(                        
                    map((sesión: Sesión) => SesiónAcciones.cargarSesiónActiva({ usuarioActivo: sesión.usuario }))
                    // catchError((error: any) => of(SesiónAcciones.clientesCargarError({ error }))) 
                )
            })
        )}
    );

    cargarSesión$ = createEffect(
        () => { return this.actions$.pipe(
            ofType(SesiónAcciones.cargarSesión),
            concatMap(() => this.sesiónServicio.obtenerSesión().pipe(                        
                    map((sesión: Sesión) => SesiónAcciones.cargarSesiónActiva({ usuarioActivo: sesión.usuario }))
                    // catchError((error: any) => of(SesiónAcciones.clientesCargarError({ error }))) 
                )
            )
        )}
    );

}