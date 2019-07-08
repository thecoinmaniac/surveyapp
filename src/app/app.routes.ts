import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AboutComponent, HomeComponent, HomeLandingComponent} from './public/home.component';
import {SecureHomeComponent} from './secure/landing/securehome.component';
import {MyProfileComponent} from './secure/profile/myprofile.component';
import {JwtComponent} from './secure/jwttokens/jwt.component';
import {UseractivityComponent} from './secure/useractivity/useractivity.component';
import {LoginComponent} from './public/auth/login/login.component';
import {RegisterComponent} from './public/auth/register/registration.component';
import {ForgotPassword2Component, ForgotPasswordStep1Component} from './public/auth/forgot/forgotPassword.component';
import {LogoutComponent, RegistrationConfirmationComponent} from './public/auth/confirm/confirmRegistration.component';
import {ResendCodeComponent} from './public/auth/resend/resendCode.component';
import {NewPasswordComponent} from './public/auth/newpassword/newpassword.component';
import {ConductSurveyComponent} from './ssa/conduct-survey/conduct-survey.component';
import {SurveyHomeComponent} from './ssa/survey-home/survey-home.component';
import {DefineSurveyComponent} from './ssa/define-survey/define-survey.component';
import {SurveyResultComponent} from './ssa/survey-result/survey-result.component';

const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {path: 'about', component: AboutComponent},
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'confirmRegistration/:username', component: RegistrationConfirmationComponent},
            {path: 'resendCode', component: ResendCodeComponent},
            {path: 'forgotPassword/:email', component: ForgotPassword2Component},
            {path: 'forgotPassword', component: ForgotPasswordStep1Component},
            {path: 'newPassword', component: NewPasswordComponent},
            {path: '', component: HomeLandingComponent}
        ]
    },
];

const secureHomeRoutes: Routes = [
    {

        path: '',
        redirectTo: '/securehome',
        pathMatch: 'full'
    },
    {
        path: 'securehome', component: SecureHomeComponent, children: [
        {path: 'logout', component: LogoutComponent},
        {path: 'jwttokens', component: JwtComponent},
        {path: 'myprofile', component: MyProfileComponent},
        {path: 'useractivity', component: UseractivityComponent},
        {path: '', component: MyProfileComponent}]
    }
];

const ssaRoutes: Routes = [
    {
      path: '',
      redirectTo: '/ssa',
      pathMatch: 'full'
    },
    {
      path: 'ssa', component: SurveyHomeComponent, children: [
        {path: 'define', component: DefineSurveyComponent},
        {path: 'conduct', component: ConductSurveyComponent},
        {path: 'result', component: SurveyResultComponent},
        {path: '', component: SurveyResultComponent}
      ]
    }
];

const routes: Routes = [
    {
        path: '',
        children: [
            ...homeRoutes,
            ...secureHomeRoutes,
            ...ssaRoutes,
            {
                path: '',
                component: HomeComponent
            }
        ]
    },


];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
