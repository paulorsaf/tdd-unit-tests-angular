import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        if (email == "error@email.com") {
          observer.error({message: "error"});
        } else {
          observer.next();
        }
        observer.complete();
      }, 2000)
    })
  }

  recoverPassword(email: string): Observable<any> {
    return of({});
  }

}
