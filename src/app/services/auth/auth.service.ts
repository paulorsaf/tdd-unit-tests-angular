import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(email: string, password: string): Observable<any> {
    return of({});
  }

  recoverPassword(email: string): Observable<any> {
    return of({});
  }

}
