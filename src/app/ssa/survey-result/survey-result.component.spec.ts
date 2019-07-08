import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {UserLoginService} from '../../service/user-login.service';
import {DynamoDBService} from '../../service/ddb.service';
import {CognitoUtil} from '../../service/cognito.service';
import {LoginComponent} from '../../public/auth/login/login.component';
import {MFAComponent} from '../../public/auth/mfa/mfa.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SsaService} from '../../../api';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SurveyResultComponent} from './survey-result.component';

describe('SurveyResultComponent', () => {
  let component: SurveyResultComponent;
  let fixture: ComponentFixture<SurveyResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'home/login', component: LoginComponent}]),
        FormsModule, HttpClientTestingModule, ReactiveFormsModule
      ],
      providers: [UserLoginService, DynamoDBService, CognitoUtil, SsaService],
      declarations: [ LoginComponent, MFAComponent, SurveyResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
