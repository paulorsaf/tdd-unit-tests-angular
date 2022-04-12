import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MessageService } from 'src/app/services/message/message.service';
import { AppState } from 'src/app/store/app-state';
import { loginFail, loginSuccess } from 'src/app/store/login/login.actions';
import { loginReducer } from 'src/app/store/login/login.reducers';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  let messageService: MessageServiceMock;
  let store: Store<AppState>;

  let page: {querySelector: Function, querySelectorAll: Function};

  beforeEach(async () => {
    messageService = new MessageServiceMock();

    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        StoreModule.forRoot([]),
        StoreModule.forFeature('login', loginReducer),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{
          path: 'home',
          loadChildren: () => import('../home/home.module').then( m => m.HomeModule)
        }]),
      ]
    })
    .overrideProvider(MessageService, {useValue: messageService})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    location = TestBed.get(Location);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('given component started, create login form', () => {
    expect(component.form).not.toBeUndefined();
  })

  describe("given login form", () => {

    it('when email is empty, then email is invalid', () => {
      setEmail('');
  
      expect(component.form.get('email')!.valid).toBeFalsy();
    })
  
    it('when email is not an email, then email is invalid', () => {
      setEmail('anything');
  
      expect(component.form.get('email')!.valid).toBeFalsy();
    })
  
    it('when email is an email, then email is valid', () => {
      setEmail('any@email.com');
  
      expect(component.form.get('email')!.valid).toBeTruthy();
    })

    it('when password is empty, then password is invalid', () => {
      setPassword('');

      expect(component.form.get('password')!.valid).toBeFalsy();
    })

    it('when password is valid, then password is valid', () => {
      setPassword('anyPassword');

      expect(component.form.get('password')!.valid).toBeTruthy();
    })

    it('when form has valid values, then form should be valid', () => {
      setEmail('any@email.com');
      setPassword('anyPassword');

      expect(component.form.valid).toBeTruthy();
    })

  })

  it('given email is invalid, then recover password button should be disabled', () => {
    setEmail("anything");

    expect(page.querySelector('[test-id="recover-password-button"]').disabled).toBeTruthy();
  })

  it('given email valid, then recover password button should be enabled', () => {
    setEmail("any@email.com");

    expect(page.querySelector('[test-id="recover-password-button"]').disabled).toBeFalsy();
  })

  it('given form invalid, then login button should be disabled', () => {
    setEmail("anything");
    setPassword("");

    expect(page.querySelector('[test-id="login-button"]').disabled).toBeTruthy();
  })

  it('given user is not logging in, then hide loading', () => {
    expect(page.querySelector('[test-id="login-loading"]')).toBeNull();
  })

  describe("given user clicks on login button", () => {

    beforeEach(() => {
      setEmail('any@email.com');
      setPassword('anyPassword');
    })

    it('then should login', done => {
      page.querySelector('[test-id="login-button"]').click();
      fixture.detectChanges();
  
      store.select('login').subscribe(state => {
        expect(state.isLoggingIn).toBeTruthy();
        done();
      })
    })

    it('then show loading', () => {
      page.querySelector('[test-id="login-button"]').click();
      fixture.detectChanges();
  
      expect(page.querySelector('[test-id="login-loading"]')).not.toBeNull();
    })

    describe("when login success", () => {

      beforeEach(() => {
        page.querySelector('[test-id="login-button"]').click();
        fixture.detectChanges();

        store.dispatch(loginSuccess());
        fixture.detectChanges();
      })

      it('then go to home page', done => {
        setTimeout(() => {
          expect(location.path()).toEqual('/home');
          done();
        }, 100);
      })
  
      it('then hide loading', () => {
        expect(page.querySelector('[test-id="login-loading"]')).toBeNull();
      })

    })

    describe('when fail', () => {

      beforeEach(() => {
        page.querySelector('[test-id="login-button"]').click();
        fixture.detectChanges();
  
        store.dispatch(loginFail({error: {error: "error"}}));
        fixture.detectChanges();
      })
  
      it('then show error message', () => {
        expect(messageService._isErrorShown).toBeTruthy();
      })
  
      it('then hide loading', () => {
        expect(page.querySelector('[test-id="login-loading"]')).toBeNull();
      })

    })

  })

  function setEmail(email: string) {
    component.form.get('email')!.setValue(email);
    fixture.detectChanges();
  }

  function setPassword(password: string) {
    component.form.get('password')!.setValue(password);
    fixture.detectChanges();
  }

  class MessageServiceMock {
    _isErrorShown = false;

    showError() {
      this._isErrorShown = true;
    }
  }

});