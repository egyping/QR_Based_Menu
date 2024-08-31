import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const params = {
      TableName: process.env.MEALS_TABLE,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'enabled',
      },
    };

    const result = await dynamodb.scan(params).promise();
    const meals = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify(meals),
    };
  } catch (error) {
    console.error('Error getting meals:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error from the function' }),
    };
  }
};