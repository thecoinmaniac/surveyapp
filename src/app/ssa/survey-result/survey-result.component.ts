import {Component, OnInit} from '@angular/core';
import {UserLoginService} from '../../service/user-login.service';
import {LoggedInCallback} from '../../service/cognito.service';
import {Router} from '@angular/router';
import {Question, SsaService, SurveyForm, SurveyResponse} from '../../../api';
import * as CanvasJS from 'src/assets/canvas-js/canvasjs.min.js';


@Component({
    selector: 'app-serverless-survey',
    templateUrl: './survey-result.component.html'
})
export class SurveyResultComponent implements LoggedInCallback, OnInit {

    public debug = false;
    public surveys: SurveyForm[];
    public activeSurvey: SurveyForm;
    public surveyResponses: SurveyResponse[];
    public charts: CanvasJS.chart[] = [];
    public errormessage = {
        message: null,
        class: 'default'
    };


    constructor(public router: Router, public userService: UserLoginService, private _ssaService: SsaService) {
        this.userService.isAuthenticated(this);
        console.log('in SurveyResultComponent: Constructor');
        _ssaService.configuration.apiKeys = {'Authorization': localStorage.getItem('AuthToken')};

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
        this.showSurveys();
    }

    showSurveys() {
        console.log('in ConductSurveyComponent: showSurveys');
        this._ssaService.getSurvey().subscribe(
            surveys => {
                console.log(surveys);
                this.surveys = surveys;
                // this.renderSurvey(surveys[0]);
            },
            err => {
                console.log(err);
                // this.errormessage.class = 'danger';
            }
        );
    }

    showResults(survey: SurveyForm) {
        this.activeSurvey = survey;
        this._ssaService.getSurveyResponse(this.activeSurvey.survey_id).subscribe(
            surveyResponses => {
                console.log(surveyResponses);
                this.surveyResponses = surveyResponses;
                this.renderResults(this.activeSurvey, this.surveyResponses);
            },
            err => {
                console.log(err);
                this.errormessage.message = err.error;
                this.errormessage.class = 'danger';
            }
        );
    }
    get_column_datapoints(question_no, option_no) {
        let count = 0;
        for (const surveyResponse of this.surveyResponses) {
            // console.log(surveyResponse);
            for (const answer of surveyResponse.responses) {
                // console.log(answer);
                if (answer.question_no === question_no && answer.option_no === option_no) {
                    count++;
                }
            }
        }
        // console.log(count);
        return count;
    }

    get_chart_columns(question: Question) {
        const datapoints = [];
        for (const option of question.options) {
            datapoints.push({y: this.get_column_datapoints(question.question_no, option.option_no), label: option.option_data});
        }
        return datapoints;
    }

    renderResults(surveyForm: SurveyForm, surveyResponses: SurveyResponse[]) {
        console.log(arguments);
        for (const question of surveyForm.questions) {
            const chart = new CanvasJS.Chart(question.question_no, {
                animationEnabled: true,
                exportEnabled: true,
                title: {
                    text: question.question_data
                },
                data: [{
                    type: 'column',
                    dataPoints: this.get_chart_columns(question)
                }]
            });
            // console.log(this._get_chart_datapoints(question));
            this.charts.push(chart);
            this.charts[this.charts.length - 1].render();
        }
        // console.log('charts: ', this.charts);
    }
}
