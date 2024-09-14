import { AWS } from '@serverless/typescript';

const snsResources: AWS['resources']['Resources'] = {
  OrderStatusSMSTopic: {
    Type: 'AWS::SNS::Topic',
    Properties: {
      TopicName: '${self:custom.stage}-OrderStatusSMSTopic',
    },
  },
  OrderStatusSMSTopicPolicy: {
    Type: 'AWS::SNS::TopicPolicy',
    Properties: {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              AWS: '*',
            },
            Action: [
              'SNS:Publish',
            ],
            Resource: {
              Ref: 'OrderStatusSMSTopic',
            },
          },
        ],
      },
      Topics: [
        {
          Ref: 'OrderStatusSMSTopic',
        },
      ],
    },
  },
  OrderStatusSMSTopicSSMParameter: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: '/${self:custom.stage}/OrderStatusSMSTopicArn',
      Type: 'String',
      Value: {
        Ref: 'OrderStatusSMSTopic',
      },
    },
  },
};

export default snsResources;