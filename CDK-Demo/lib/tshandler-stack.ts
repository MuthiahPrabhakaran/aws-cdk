import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 } from 'aws-cdk-lib';
import { Runtime, Code, Function as LambdaFunction } from  'aws-cdk-lib/aws-lambda';


interface TsHandlerStackProps extends cdk.StackProps {
    coolBucket: aws_s3.Bucket
}

export class TsHandlerStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: TsHandlerStackProps) {
        super(scope, id, props);
        new LambdaFunction(this, 'PhotosHandler', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: Code.fromInline(`
                exports.handler = async (event) => {
                console.log("Event received:", event);
                return {
                  statusCode: 200,
                 body: JSON.stringify({ message: "Hello from inline Node.js Lambda!. Bucket name: " + process.env.COOL_BUCKET_ARN }),
                    };
                 };
                `),
                environment: {
                    COOL_BUCKET_ARN: props.coolBucket.bucketArn
                }
        })
    }

}