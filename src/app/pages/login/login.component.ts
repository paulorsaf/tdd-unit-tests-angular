import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message/message.service';
import { AppState } from 'src/app/store/app-state';
import { login } from 'src/app/store/login/login.actions';
import { LoginState } from 'src/app/store/login/login.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  isLoggingIn$!: Observable<boolean>;

  loginSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })

    this.isLoggingIn$ = this.store.select(state => state.login.isLoggingIn);

    this.loginSubscription =
      this.store.select('login').subscribe(state => {
        this.onLoginSuccess(state);
        this.onLoginFail(state);
      })
  }

  private onLoginSuccess(state: LoginState) {
    if (state.isLoggedIn) {
      this.router.navigate(['home']);
    }
  }

  private onLoginFail(state: LoginState) {
    if (state.error) {
      this.messageService.showError(state.error)
    }
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  login() {
    this.store.dispatch(login({
      email: this.form.value.email,
      password: this.form.value.password
    }));
  }

}
