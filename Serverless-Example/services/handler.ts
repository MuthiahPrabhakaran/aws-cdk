import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { postEmpl } from "./postEmpl";
import { getEmpl } from "./GetEmpl";


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let response: APIGatewayProxyResult = {} as any;

    try {
        switch(event.httpMethod) {
            case 'GET':
                const getResponse = await getEmpl(event, ddbClient);
                response = getResponse;
                break;
            case 'POST':
                const postResponse = await postEmpl(event, ddbClient);
                response = postResponse;
                break;    
        }
    } catch(error) {
        return {
        statusCode: 200,
        body: JSON.stringify(error.message)
    }
    }

    response.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    }
    return response;

    
}

export { handler}