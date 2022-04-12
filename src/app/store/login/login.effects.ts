import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth/auth.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { login, loginFail, loginSuccess } from './login.actions';
import { of } from 'rxjs';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap((params: {email: string, password: string}) =>
        this.authService.login(params.email, params.password).pipe(
            map(() => loginSuccess()),
            catchError(error => of(loginFail({error})))
        )
      )
    )
  );
}
