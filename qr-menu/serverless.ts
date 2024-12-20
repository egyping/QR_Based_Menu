
import type { AWS } from '@serverless/typescript';
import functions from './serverless/functions';
import dynamoResources  from './serverless/dynamoResources';
import cognitoResources from './serverless/cognitoResources';
import snsResources from './serverless/snsResources'

const serverlessConfiguration: AWS = {
  
  service: 'qr-menu',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild',],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    //runtime: 'nodejs20.x',
    region: 'us-east-1',
    profile: "serverlessUser",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      MEALS_TABLE: '${self:custom.stage}-Meals',
      CART_TABLE: '${self:custom.stage}-Cart',
      ORDERS_TABLE: '${self:custom.stage}-Orders',
      CUSTOMERS_TABLE: '${self:custom.stage}-Customers',
      COGNITO_USER_POOL_CLIENT_ID: { Ref: 'CognitoUserPoolClient' },
      ORDER_STATUS_SMS_TOPIC_ARN: {
        Ref: 'OrderStatusSMSTopic',
      },
    },

    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: [
              { 'Fn::GetAtt': ['MealsTable', 'Arn'] },
              { 'Fn::GetAtt': ['OrdersTable', 'Arn'] },
              //{ 'Fn::GetAtt': ['OrderItemsTable', 'Arn'] },
              { 'Fn::GetAtt': ['CustomersTable', 'Arn'] },
              { 'Fn::GetAtt': ['CartTable', 'Arn'] },
              { 'Fn::Join': ['/', [{ 'Fn::GetAtt': ['CartTable', 'Arn'] }, 'index/*']] },
              { 'Fn::Join': ['/', [{ 'Fn::GetAtt': ['MealsTable', 'Arn'] }, 'index/*']] },
              { 'Fn::Join': ['/', [{ 'Fn::GetAtt': ['OrdersTable', 'Arn'] }, 'index/*']] },
              { 'Fn::Join': ['/', [{ 'Fn::GetAtt': ['CustomersTable', 'Arn'] }, 'index/*']] },
            ],
          },
          {
            Effect: 'Allow',
            Action: ['s3:GetObject', 's3:PutObject'],
            Resource: 'arn:aws:s3:::qrmenuimages/*',
          },
          {
            Effect: 'Allow',
            Action: [
              'sns:Publish',
            ],
            Resource: '*',
          },
        ],
      },
    },
  },


  // import the function via paths
  functions,
  resources: {
    Resources: {
      ...dynamoResources,
      ...cognitoResources,
      ...snsResources,
    },
  },

  custom: {
    stage: '${opt:stage, "dev"}',
    //eventBrigeBusName: 'ordersEventBus',
    smsSettings: {
      defaultSMSType: 'Transactional',
      defaultSenderID: 'YourSenderID',
      deliveryStatusIAMRole: {
        'Fn::GetAtt': ['DeliveryStatusIAMRole', 'Arn'],
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
