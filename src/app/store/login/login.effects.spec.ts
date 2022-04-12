import { TestBed } from "@angular/core/testing";
import { EffectsModule } from "@ngrx/effects";
import { Action, StoreModule } from "@ngrx/store";
import { Observable, of, throwError } from "rxjs";
import { LoginEffects } from "./login.effects"
import { provideMockActions } from '@ngrx/effects/testing';
import { AuthService } from "../../services/auth/auth.service";
import { login, loginFail, loginSuccess } from "./login.actions";

describe('Login effects', () => {

    let effects: LoginEffects;
    let actions$: Observable<Action>;

    let authService: AuthServiceMock;

    const error = {error: "error"};

    beforeEach(() => {
        authService = new AuthServiceMock();

        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot([]),
                EffectsModule.forRoot([]),
                EffectsModule.forFeature([
                    LoginEffects
                ])
            ],
            providers: [
                provideMockActions(() => actions$)
            ]
        })
        .overrideProvider(AuthService, {useValue: authService})

        effects = TestBed.get(LoginEffects);
    })

    describe("Given login", () => {

        beforeEach(() => {
            actions$ = of(login({email: "any@email.com", password: "123456"}));
        })

        it('when success, then return login success', done => {
            authService._response = of({});

            effects.login$.subscribe(newAction => {
                expect(newAction).toEqual(loginSuccess());
                done();
            });
        })

        it('when fail, then return login fail', done => {
            authService._response = throwError(error);

            effects.login$.subscribe(newAction => {
                expect(newAction).toEqual(loginFail({error}));
                done();
            });
        })

    })

    class AuthServiceMock {
        _response: any;

        login() {
            return this._response;
        }
    }

})
