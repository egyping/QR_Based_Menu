import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const params = {
      TableName: process.env.MEALS_TABLE,
    };

    const result = await dynamodb.scan(params).promise();
    const meals = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify(meals),
    };
  } catch (error) {
    console.error('Error listing meals:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};