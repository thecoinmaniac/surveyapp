import {Component, OnInit} from '@angular/core';
import {UserLoginService} from '../../service/user-login.service';
import {LoggedInCallback} from '../../service/cognito.service';
import {Router} from '@angular/router';
import {SsaService, SurveyForm, SurveyResponse} from '../../../api';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';


@Component({
    selector: 'app-serverless-survey',
    templateUrl: './conduct-survey.component.html'
})
export class ConductSurveyComponent implements LoggedInCallback, OnInit {
    public debug = false;
    public surveys: SurveyForm[];
    public activeSurvey: SurveyForm;
    public surveyResponseForm: FormGroup; // our model driven form
    public submitted = false; // keep track on whether form is submitted
    public events: any[] = []; // use later to display form changes
    public submitResponse: any;
    public errormessage = {
        message: null,
        class: 'default'
    };

    // public debugLog(...args: any[]) {
    //     if (this.debug) {
    //         console.log(...args);
    //     }
    // }

    constructor(public router: Router,
                public userService: UserLoginService,
                private ssaService: SsaService,
                private _fb: FormBuilder) {
        this.userService.isAuthenticated(this);
        console.log('in ConductSurveyComponent: Constructor');
        ssaService.configuration.apiKeys = {'Authorization': localStorage.getItem('AuthToken')};
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            console.log('in ConductSurveyComponent: isLoggedIn');
        } else {
            console.log(this.router.navigate(['/home/login']));
        }
    }

    ngOnInit(): void {
        console.log('in ConductSurveyComponent: ngOnInit');

        this.surveyResponseForm = this._fb.group({
            survey_id: ['', [<any>Validators.required]],
            responses: this._fb.array([])
            //     this._fb.group({
            //         question_no: ['', <any>Validators.required],
            //         option_no: ['', <any>Validators.required]
            //     })
            // ])
        });
        this.showSurveys();
        // subscribe to form changes
        this.subcribeToFormChanges();
    }

    subcribeToFormChanges() {
        const surveyResponseFormStatusChanges$ = this.surveyResponseForm.statusChanges;
        const surveyResponseFormValueChanges$ = this.surveyResponseForm.valueChanges;

        surveyResponseFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        surveyResponseFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    save(model: SurveyResponse, isValid: boolean) {
        if (isValid) {
            this.submitted = true; // set form submit to true
            this.submitResponse = model;
            this.ssaService.respondSurvey(model).subscribe(
                response => {
                    this.submitResponse = response;
                    this.errormessage.message = 'Response Submitted!';
                    this.errormessage.class = 'success';
                },
                err => {
                    console.log(err);
                    this.submitResponse = err;
                    this.submitted = false;
                    this.errormessage.message = err.error;
                    this.errormessage.class = 'danger';
                }
            );
        }
        // check if model is valid
        // if valid, call API to save customer
        console.log(model, isValid);
    }

    showSurveys() {
        console.log('in ConductSurveyComponent: showSurveys');
        this.ssaService.getSurvey().subscribe(
            surveys => {
                console.log(surveys);
                this.surveys = surveys;
                // this.renderSurvey(surveys[0]);
                this.submitResponse = surveys;
            },
            err => {
                console.log(err);
                this.submitResponse = err;
                // this.errormessage.message = err.error;
                // this.errormessage.class = 'danger';
            }
        );
    }

    renderSurvey(survey: SurveyForm) {
        console.log('in ConductSurveyComponent: renderSurvey');
        this.activeSurvey = survey;
        console.log(this.activeSurvey);
        this.surveyResponseForm.patchValue({'survey_id': this.activeSurvey.survey_id});

        // get reference to responsesarray
        const responseFormArray = this.surveyResponseForm.get('responses') as FormArray;

        // clearing the form array
        while (responseFormArray.length !== 0) {
            responseFormArray.removeAt(0);
          }

        // pushing questions into form array
        for (const question of this.activeSurvey.questions) {
            const questionFormGroup = this._fb.group({
                question_no: [question.question_no, <any>Validators.required],
                option_no: ['', <any>Validators.required]
            });
            responseFormArray.push(questionFormGroup);
        }
        console.log(this.surveyResponseForm);
        // this.surveyResponseForm.setControl('responses', responseFormArray);
        console.log(this.surveys);
    }
}
