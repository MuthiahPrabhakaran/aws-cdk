import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import { DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

export async function postEmpl(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
   
    if(event.body) {
        const randomId = randomUUID();
        const item = JSON.parse(event.body);
        item.id = randomId;

        await ddbClient.send(new PutItemCommand({
            TableName: process.env.TABLE_NAME,
            Item: marshall(item)
        }));

        return {
            statusCode: 201,
            body: JSON.stringify("user created with the id: " + JSON.stringify(randomId))
        }
    }
    return {
            statusCode: 200,
            body: JSON.stringify("Bad request")
        }
}