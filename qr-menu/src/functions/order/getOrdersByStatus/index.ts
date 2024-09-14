
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { status } = JSON.parse(event.body);

  try {
    const scanParams = {
      TableName: process.env.ORDERS_TABLE,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      ProjectionExpression: 'orderId, tableNumber, customerName',
    };

    const scanResult = await dynamodb.scan(scanParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(scanResult.Items),
    };
  } catch (error) {
    console.error('Error getting orders by status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};