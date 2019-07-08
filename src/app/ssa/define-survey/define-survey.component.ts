import {Component, OnInit} from '@angular/core';
import {UserLoginService} from '../../service/user-login.service';
import {LoggedInCallback} from '../../service/cognito.service';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurveyForm, SsaService} from '../../../api';

@Component({
    selector: 'app-serverless-survey',
    templateUrl: './define-survey.component.html'
})

export class DefineSurveyComponent implements LoggedInCallback, OnInit {
    public debug = true;
    public surveyForm: FormGroup; // our model driven form
    public submitted = false; // keep track on whether form is submitted
    public events: any[] = []; // use later to display form changes
    public submitResponse: any;
    public errormessage = {
        message: null,
        class: 'default'
    };

    constructor(private ssaService: SsaService, private _fb: FormBuilder, public router: Router,
                public userService: UserLoginService) {
        this.userService.isAuthenticated(this);
        console.log('in DefineSurveyComponent: Constructor');
        ssaService.configuration.apiKeys = {'Authorization': localStorage.getItem('AuthToken')};
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            console.log('in DefineSurveyComponent: isLoggedIn');
        } else {
            this.router.navigate(['/home/login']);
        }
    }

    ngOnInit(): void {
        console.log('in DefineSurveyComponent: ngOnInit');

        /* Initiating the form structure */
        this.surveyForm = this._fb.group({
            survey_title: ['', Validators.required],
            questions: this._fb.array([
                this._fb.group({
                    question_no: ['1'],
                    question_data: ['', Validators.required],
                    options: this._fb.array([
                        this._fb.group({
                            option_no: ['1'],
                            option_data: ['', Validators.required]
                        })
                    ])
                })
            ])
        });
        console.log(this.surveyForm);
        this.subcribeToFormChanges();
    }

    addQuestion() {
        const questions = this.surveyForm.get('questions') as FormArray;
        console.log(questions);
        if (questions.length < 10 && this.surveyForm.valid) {
            questions.push(
                this._fb.group({
                    question_no: [(questions.length + 1).toString(), Validators.required],
                    question_data: ['', Validators.required],
                    options: this._fb.array([
                        this._fb.group({
                            option_no: ['1'],
                            option_data: ['', Validators.required]
                        })
                    ])
                })
            );
        }
    }

    addOption(index: number) {
        const questions = this.surveyForm.get('questions') as FormArray;
        const question = questions.at(index) as FormGroup;
        const options = question.get('options') as FormArray;
        if (options.length < 5 && question.valid) {
            options.push(
                this._fb.group({
                    option_no: [(options.length + 1).toString(), Validators.required],
                    option_data: ['', Validators.required]
                })
            );
        }
    }

    subcribeToFormChanges() {
        const surveyFormStatusChanges$ = this.surveyForm.statusChanges;
        const surveyFormValueChanges$ = this.surveyForm.valueChanges;

        surveyFormStatusChanges$.subscribe(x => this.events.push({event: 'STATUS_CHANGED', object: x}));
        surveyFormValueChanges$.subscribe(x => this.events.push({event: 'VALUE_CHANGED', object: x}));
    }

    save(model: SurveyForm, isValid: boolean) {
        this.submitted = true; // set form submit to true

        // check if model is valid
        if (isValid) {
            this.submitResponse = model;
            // if valid, call API to save customer
            this.ssaService.addSurvey(model).subscribe(
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

        console.log(model, isValid);
    }

    cancelSurvey() {
        this.router.navigate(['/ssa/result']);
    }
}
