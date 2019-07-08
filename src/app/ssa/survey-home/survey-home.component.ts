import {Component, OnInit} from '@angular/core';
import {UserLoginService} from '../../service/user-login.service';
import {Callback, CognitoUtil, LoggedInCallback} from '../../service/cognito.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-serverless-survey',
    templateUrl: './survey-home.component.html'
})
export class SurveyHomeComponent implements LoggedInCallback, OnInit {

    constructor(public router: Router, public userService: UserLoginService, public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        console.log('in SurveyHomeComponent: Constructor');
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            console.log('in DefineSurveyComponent: isLoggedIn');
        } else {
            this.router.navigate(['/home/login']);
        }
    }

    ngOnInit(): void {
        console.log('in SurveyHomeComponent: ngOnInit');
        this.cognitoUtil.getIdToken(new SSAIdTokenCallback(this));
    }
}

export class SSAIdTokenCallback implements Callback {
    constructor(public ssahome: SurveyHomeComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        localStorage.setItem('AuthToken', result);
    }
}
