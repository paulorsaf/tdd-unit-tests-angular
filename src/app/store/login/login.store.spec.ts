import { AppInitialState } from "../app-initial-state"
import { login, loginFail, loginSuccess } from "./login.actions"
import { loginReducer } from "./login.reducers"

describe('Login store', () => {

    it('login', () => {
        const initialState = {
            ...AppInitialState.login,
            error: {},
            isLoggedIn: true,
            isLoggingIn: false
        };

        const newState = loginReducer(initialState, login({email: "any@email.com", password: "123456"}));

        expect(newState).toEqual({
            ...initialState,
            error: null,
            isLoggedIn: false,
            isLoggingIn: true
        });
    })

    it('loginSuccess', () => {
        const initialState = {
            ...AppInitialState.login,
            isLoggingIn: true
        };

        const newState = loginReducer(initialState, loginSuccess());

        expect(newState).toEqual({
            ...initialState,
            isLoggedIn: true,
            isLoggingIn: false
        });
    })

    it('loginFail', () => {
        const initialState = {
            ...AppInitialState.login,
            isLoggingIn: true
        };

        const error = {error: "error"};
        const newState = loginReducer(initialState, loginFail({error}));

        expect(newState).toEqual({
            ...initialState,
            error,
            isLoggedIn: false,
            isLoggingIn: false
        });
    })

})