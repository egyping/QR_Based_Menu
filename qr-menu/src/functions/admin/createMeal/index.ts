import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title, description, price, imageUrl, status } = JSON.parse(event.body || '{}');

  try {
    const mealId = uuid();
    const meal = {
      mealId,
      title,
      description,
      price,
      imageUrl,
      status,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: process.env.MEALS_TABLE,
      Item: meal,
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(meal),
    };
  } catch (error) {
    console.error('Error creating meal:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};