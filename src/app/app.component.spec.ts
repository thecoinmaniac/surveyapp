import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AwsUtil} from './service/aws.service';
import {CognitoUtil} from './service/cognito.service';
import {UserLoginService} from './service/user-login.service';
import {UserRegistrationService} from './service/user-registration.service';
import {UserParametersService} from './service/user-parameters.service';
import {DynamoDBService} from './service/ddb.service';
import {HomeLandingComponent} from './public/home.component';
import {browser} from 'protractor';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeLandingComponent
      ],
      imports: [ RouterTestingModule ],
      providers: [
        AwsUtil,
        CognitoUtil,
        UserLoginService,
        UserRegistrationService,
        UserParametersService,
        DynamoDBService,
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it('should verify the page title', () => {
  //   browser.get('http://localhost:9876');
  //   const pageTitle = browser.getTitle();
  //   expect<any>(pageTitle).toEqual('SSA');
  //
  // });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(HomeLandingComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Serverless Survey App');
  });
});

