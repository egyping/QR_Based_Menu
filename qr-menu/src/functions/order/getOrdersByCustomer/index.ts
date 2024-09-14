import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { customerMobileNumber } = JSON.parse(event.body);

  try {
    const queryParams = {
      TableName: process.env.ORDERS_TABLE,
      IndexName: 'CustomerMobileNumberIndex',
      KeyConditionExpression: 'customerMobileNumber = :customerMobileNumber',
      ExpressionAttributeValues: {
        ':customerMobileNumber': customerMobileNumber,
      },
    };

    const queryResult = await dynamodb.query(queryParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(queryResult.Items),
    };
  } catch (error) {
    console.error('Error getting orders by customer:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};