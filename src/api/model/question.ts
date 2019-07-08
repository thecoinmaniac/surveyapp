/**
 * SSA
 * This is the internal API for 'Serverless SurveyForm App'.
 *
 * OpenAPI spec version: 0.1
 * Contact: ajay.t.kumar@capgemini.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Option } from './option';


export interface Question { 
    question_no?: string;
    question_data?: string;
    options?: Array<Option>;
}
