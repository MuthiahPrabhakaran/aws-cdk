import * as cdk from 'aws-cdk-lib';
import { Construct, Node } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, ResourceOptions, RestApi, Cors } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';

export class ServerlessExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const employeesTable = new TableV2(this, 'EmplTable', {
      partitionKey: {
          name: 'id',
          type: AttributeType.STRING,
        },
      billing: Billing.onDemand()
    });


    // Lambda
    const emplLambda = new NodejsFunction(this, 'Ts-EmplLambda', {
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: (join(__dirname, '..', 'services', 'handler.ts')),
        environment: {
          TABLE_NAME: employeesTable.tableName
        }
  })

  // Permission to lambda to perform operation on DynamoDB
  employeesTable.grantReadWriteData(emplLambda);
  

  // API Gateway
  const api = new RestApi(this, 'TS-EmplApi');
  const optionsWithCors: ResourceOptions = {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS
    }
  }
  const emplResource = api.root.addResource('empl', optionsWithCors);

  const emplLambdaIntegration = new LambdaIntegration(emplLambda);
  emplResource.addMethod('GET', emplLambdaIntegration);
  emplResource.addMethod('POST', emplLambdaIntegration);
  }
}
