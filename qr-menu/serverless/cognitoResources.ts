import type { AWS } from '@serverless/typescript';

const CognitoResources: AWS['resources']['Resources'] = {
  CognitoUserPool: {
    Type: 'AWS::Cognito::UserPool',
    Properties: {
      UserPoolName: '${sls:stage}-${self:service}-user-pool',
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
      Policies: {
        PasswordPolicy: {
          MinimumLength: 6,
          RequireLowercase: false,
          RequireNumbers: false,
          RequireUppercase: false,
          RequireSymbols: false,
        },
      },
    },
  },

  CognitoUserPoolClient: {
    Type: 'AWS::Cognito::UserPoolClient',
    Properties: {
      UserPoolId: { Ref: 'CognitoUserPool' },
      CallbackURLs: ['http://localhost:3000'],
      SupportedIdentityProviders: ['COGNITO'],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthFlows: ['implicit'],
      AllowedOAuthScopes: ['openid', 'profile', 'email'],
      ExplicitAuthFlows: ['ALLOW_USER_PASSWORD_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
    },
  },
}
export default CognitoResources;