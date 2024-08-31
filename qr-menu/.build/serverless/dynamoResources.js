const dynamoResources = {
    MealsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: '${self:custom.stage}-Meals',
            AttributeDefinitions: [
                { AttributeName: 'mealId', AttributeType: 'S' },
                { AttributeName: 'status', AttributeType: 'S' },
            ],
            KeySchema: [
                { AttributeName: 'mealId', KeyType: 'HASH' },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'StatusIndex',
                    KeySchema: [
                        { AttributeName: 'status', KeyType: 'HASH' },
                    ],
                    Projection: {
                        ProjectionType: 'ALL',
                    },
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
        },
    },
    OrdersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: '${self:custom.stage}-Orders',
            AttributeDefinitions: [
                { AttributeName: 'orderId', AttributeType: 'S' },
                { AttributeName: 'customerMobileNumber', AttributeType: 'S' },
                { AttributeName: 'createdAt', AttributeType: 'N' },
            ],
            KeySchema: [
                { AttributeName: 'orderId', KeyType: 'HASH' },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'CustomerMobileNumberIndex',
                    KeySchema: [
                        { AttributeName: 'customerMobileNumber', KeyType: 'HASH' },
                        { AttributeName: 'createdAt', KeyType: 'RANGE' },
                    ],
                    Projection: { ProjectionType: 'ALL' },
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
        },
    },
    OrderItemsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: '${self:custom.stage}-OrderItems',
            AttributeDefinitions: [
                { AttributeName: 'orderItemId', AttributeType: 'S' },
                { AttributeName: 'orderId', AttributeType: 'S' },
            ],
            KeySchema: [
                { AttributeName: 'orderItemId', KeyType: 'HASH' },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'OrderIdIndex',
                    KeySchema: [
                        { AttributeName: 'orderId', KeyType: 'HASH' },
                    ],
                    Projection: { ProjectionType: 'ALL' },
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
        },
    },
    CustomersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: '${self:custom.stage}-Customers',
            AttributeDefinitions: [
                { AttributeName: 'mobileNumber', AttributeType: 'S' },
            ],
            KeySchema: [
                { AttributeName: 'mobileNumber', KeyType: 'HASH' },
            ],
            BillingMode: 'PAY_PER_REQUEST',
        },
    },
};
export default dynamoResources;
//# sourceMappingURL=dynamoResources.js.map