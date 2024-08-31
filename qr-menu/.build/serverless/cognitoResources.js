const CognitoResources = {
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
        },
    },
};
export default CognitoResources;
//# sourceMappingURL=cognitoResources.js.map