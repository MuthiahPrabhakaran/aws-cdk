import * as cdk from 'aws-cdk-lib';
import { Template, Match, Capture } from 'aws-cdk-lib/assertions';
import * as CdkTesting from '../lib/cdk-testing-stack';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';

describe('CdkTestingStack test suite', () => {

    let template: cdk.assertions.Template;

    beforeAll(() => {
        const app = new cdk.App({
            outdir: 'cdk.out/test'
        });
        const stack = new CdkTesting.CdkTestingStack(app, 'MyTestStack');
        template = Template.fromStack(stack);

    })


    test('Lambda runtime check', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Runtime: "nodejs18.x"
        });
        template.resourceCountIs('AWS::Lambda::Function', 1);
    });

    test('Lambda runtime check', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Runtime: Match.stringLikeRegexp('nodejs')
        });
    });

    test('Lambda bucket policy with matchers', () => {
        template.hasResourceProperties('AWS::IAM::Policy',
            Match.objectLike({
                PolicyDocument: {
                    Statement: [{
                        Resource: [{
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('CdkTestingBucket'),
                                'Arn'
                            ]
                        },
                        Match.anyValue() // Because the actual statement contains Fn get and join. Since we test get, for join -> i am using any
                        ]
                    }]
                }
            })
        );
    });

    test('Lambda actions with capture', () => {
        const lambdaActionsCapture = new Capture();
        template.hasResourceProperties('AWS::IAM::Policy', { // after this gets executed, the capture object contains the actual object
            PolicyDocument: {
                Statement: [{
                    Action: lambdaActionsCapture
                }]
            }
        });
        const executedActions  = [
        "s3:GetObject*",
        "s3:GetBucket*",
        "s3:List*"
       ]
       expect(lambdaActionsCapture.asArray()).toEqual(
        expect.arrayContaining(executedActions)
       )
    });

    test('Bucket properties with snapshot', () => {
        const bucketTemplate = template.findResources("AWS::S3::Bucket");
        expect(bucketTemplate).toMatchSnapshot()
    })


});
