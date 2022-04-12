import { createReducer, on } from '@ngrx/store';
import { AppInitialState } from '../app-initial-state';
import { login, loginFail, loginSuccess } from './login.actions';
import { LoginState } from './login.state';

const initialState: LoginState = AppInitialState.login;

const _loginReducer = createReducer(
  initialState,
  on(login, (state) => {
    return {
      ...state,
      error: null,
      isLoggedIn: false,
      isLoggingIn: true
    };
  }),
  on(loginSuccess, (state) => {
    return {
      ...state,
      isLoggedIn: true,
      isLoggingIn: false
    };
  }),
  on(loginFail, (state, action) => {
    return {
      ...state,
      error: action.error,
      isLoggedIn: false,
      isLoggingIn: false
    };
  })
);

export function loginReducer(state: LoginState, action: any): LoginState {
  return _loginReducer(state, action);
}