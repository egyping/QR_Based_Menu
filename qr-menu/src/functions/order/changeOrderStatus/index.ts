
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { orderId } = event.pathParameters;
  const { status } = JSON.parse(event.body);

  try {
    // Check if the order exists
    const getOrderParams = {
      TableName: process.env.ORDERS_TABLE,
      Key: { orderId },
    };
    const getOrderResult = await dynamodb.get(getOrderParams).promise();

    if (!getOrderResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Order not found' }),
      };
    }

    // Update the order status
    const updateOrderParams = {
      TableName: process.env.ORDERS_TABLE,
      Key: { orderId },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      ReturnValues: 'ALL_NEW',
    };
    const updateOrderResult = await dynamodb.update(updateOrderParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updateOrderResult.Attributes),
    };
  } catch (error) {
    console.error('Error changing order status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};