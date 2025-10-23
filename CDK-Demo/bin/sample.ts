#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SampleStack } from '../lib/sample-stack';
import { TsHandlerStack } from '../lib/tshandler-stack';

const app = new cdk.App();
const tsStarterStack = new SampleStack(app, 'SampleStack');
new TsHandlerStack(app, 'TsHandlerStack', {
  coolBucket: tsStarterStack.coolBucket
});