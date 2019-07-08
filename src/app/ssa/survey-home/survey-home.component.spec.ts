import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyHomeComponent } from './survey-home.component';
import {RouterTestingModule} from '@angular/router/testing';
import {UserLoginService} from '../../service/user-login.service';
import {DynamoDBService} from '../../service/ddb.service';
import {CognitoUtil} from '../../service/cognito.service';
import {LoginComponent} from '../../public/auth/login/login.component';
import {MFAComponent} from '../../public/auth/mfa/mfa.component';
import {FormsModule} from '@angular/forms';

describe('SurveyHomeComponent', () => {
  let component: SurveyHomeComponent;
  let fixture: ComponentFixture<SurveyHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'home/login', component: LoginComponent}]),
        FormsModule
      ],
      providers: [UserLoginService, DynamoDBService, CognitoUtil],
      declarations: [ LoginComponent, MFAComponent, SurveyHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
