import type { AWS } from '@serverless/typescript'
//import type { AWS } from '@serverless/typescript';

interface Authorizer {
  name: string;
  type: string;
  arn: {
    'Fn::GetAtt': string[];
  };
}
const authorizer: Authorizer = {
  name: 'authorizer',
  type: 'COGNITO_USER_POOLS',
  arn: { 'Fn::GetAtt': ['CognitoUserPool', 'Arn'] },
};

const corsSettings = {
  headers: [
      // Specify allowed headers
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'X-Amz-Security-Token',
      'X-Amz-User-Agent',
    ],
    allowCredentials: false,
}

const functions: AWS['functions'] = {
  getMeals: {
    handler: 'src/functions/getMeals/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'meals',
        },
      },
    ],
  },

  login: {
    handler: 'src/functions/admin/auth/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'auth/login',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },
  listMeals: {
    handler: 'src/functions/admin/listMeals/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'meals',
        },
      },
    ],
  },
  createMeal: {
    handler: 'src/functions/admin/createMeal/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'meals',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },
};


export default functions;