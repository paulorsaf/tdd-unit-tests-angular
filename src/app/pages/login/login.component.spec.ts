import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MessageService } from 'src/app/services/message/message.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  let authService: AuthServiceMock;
  let messageService: MessageServiceMock;

  let page: {querySelector: Function, querySelectorAll: Function};

  beforeEach(async () => {
    authService = new AuthServiceMock();
    messageService = new MessageServiceMock();

    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{
          path: 'home',
          loadChildren: () => import('../home/home.module').then( m => m.HomeModule)
        }])
      ]
    })
    .overrideProvider(AuthService, {useValue: authService})
    .overrideProvider(MessageService, {useValue: messageService})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    location = TestBed.get(Location);
    messageService = TestBed.get(MessageService);
    
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

  describe("given user clicks on login button", () => {

    beforeEach(() => {
      setEmail('any@email.com');
      setPassword('anyPassword');
    })

    it('given user clicks on login button, when success, then go to home page', done => {
      authService._response = of({});
  
      page.querySelector('[test-id="login-button"]').click();
      fixture.detectChanges();
  
      setTimeout(() => {
        expect(location.path()).toEqual('/home');
        done();
      }, 100);
    })
  
    it('given user clicks on login button, when fail, then show error message', () => {
      authService._response = throwError({error: "error"});
  
      page.querySelector('[test-id="login-button"]').click();
      fixture.detectChanges();
  
      expect(messageService._isErrorShown).toBeTruthy();
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

  class AuthServiceMock {
    _response: any;

    login() {
      return this._response;
    }
  }

  class MessageServiceMock {
    _isErrorShown = false;

    showError() {
      this._isErrorShown = true;
    }
  }

});