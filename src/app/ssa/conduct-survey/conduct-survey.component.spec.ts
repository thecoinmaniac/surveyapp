import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductSurveyComponent } from './conduct-survey.component';
import {RouterTestingModule} from '@angular/router/testing';
import {UserLoginService} from '../../service/user-login.service';
import {DynamoDBService} from '../../service/ddb.service';
import {CognitoUtil} from '../../service/cognito.service';
import {LoginComponent} from '../../public/auth/login/login.component';
import {MFAComponent} from '../../public/auth/mfa/mfa.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SsaService} from '../../../api';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ConductSurveyComponent', () => {
  let component: ConductSurveyComponent;
  let fixture: ComponentFixture<ConductSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'home/login', component: LoginComponent}]),
        FormsModule, HttpClientTestingModule, ReactiveFormsModule
      ],
      providers: [UserLoginService, DynamoDBService, CognitoUtil, SsaService],
      declarations: [ LoginComponent, MFAComponent, ConductSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
