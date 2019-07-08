import boto3
import json

# SurveyFormTableName = "dev-dynamodb-ssa"
# SurveyResponseTableName = "dev-dynamodb-ssa"

print('Loading function')
dynamo = boto3.resource('dynamodb')


# SurveyFormTable = dynamo.Table(SurveyFormTableName)
# SurveyResponseTable = dynamo.Table(SurveyResponseTableName)


def respond(err, res=None):
    print(err, res)
    return {
        'statusCode': '400' if err else '200',
        'body': err if err else json.dumps(res),
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
    }


def get_payload(event, operation, path):
    if operation == 'GET':
        query = event['queryStringParameters']
        print('query: ', query)

        if query and 'survey_id' in query:
            fe = boto3.dynamodb.conditions.Attr('survey_id').eq(query['survey_id']);
            payload = {'FilterExpression': fe}
        else:
            payload = {}
    else:
        payload = json.loads(event['body'])
        key = 'survey_id' if path == 'surveyform' else 'response_id'
        payload.update({key: event['requestContext']["extendedRequestId"]})
        payload = {'Item': payload}

    # print('payload: {}'.format(payload))
    return payload


def lambda_handler(event, context):
    """
    Demonstrates a simple HTTP endpoint using API Gateway. You have full
    access to the request and response payload, including headers and
    status code.

    To scan a DynamoDB table, make a GET request with the TableName as a
    query string parameter. To put, update, or delete an item, make a POST,
    PUT, or DELETE request respectively, passing in the payload to the
    DynamoDB API as a JSON body.
    """
    # try:

    # print("Received event: " + json.dumps(event, indent=2))
    print(event)

    operations = {
        'GET': lambda table, x: table.scan(**x)['Items'],
        'POST': lambda table, x: table.put_item(**x)
    }

    path = event['path'].split('/')[1]
    operation = event['httpMethod']

    print(dict(path=path, operation=operation))
    if path in ('surveyform', 'surveyresponse'):
        if operation in operations:
            payload = get_payload(event, operation, path)
            ddbtable = dynamo.Table('cos2-' + path)
            print("payload: {}".format(payload))
            print("table: {}".format(ddbtable.table_name))

            response_body = operations[operation](ddbtable, payload)

            response = respond(None, response_body)

        else:
            response = respond(ValueError('Unsupported operation "{}"'.format(operation)))
    else:
        response = respond(ValueError('Unsupported path "{}"'.format(path)))

    print(response)
    return response
