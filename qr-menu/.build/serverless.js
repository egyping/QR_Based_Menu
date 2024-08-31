import functions from './serverless/functions';
import dynamoResources from './serverless/dynamoResources';
import cognitoResources from './serverless/cognitoResources';
const serverlessConfiguration = {
    service: 'qr-menu',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-plugin-typescript'],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
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
                            { 'Fn::GetAtt': ['OrderItemsTable', 'Arn'] },
                            { 'Fn::GetAtt': ['CustomersTable', 'Arn'] },
                            { 'Fn::Join': ['/', [{ 'Fn::GetAtt': ['MealsTable', 'Arn'] }, 'index/*']] },
                        ],
                    },
                    {
                        Effect: 'Allow',
                        Action: ['s3:GetObject', 's3:PutObject'],
                        Resource: 'arn:aws:s3:::qrmenuimages/*',
                    },
                ],
            },
        },
    },
    functions,
    resources: {
        Resources: {
            ...dynamoResources,
            ...cognitoResources,
        },
    },
    custom: {
        stage: '${opt:stage, "dev"}',
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
//# sourceMappingURL=serverless.js.map