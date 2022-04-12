import { createAction, props } from "@ngrx/store";

export const login = createAction("[Login] login", props<{email: string, password: string}>());
export const loginSuccess = createAction("[Login] login success");
export const loginFail = createAction("[Login] login fail", props<{error: any}>());