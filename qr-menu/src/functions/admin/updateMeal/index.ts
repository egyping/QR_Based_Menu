import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { mealId } = event.pathParameters;
  const updatedMeal = JSON.parse(event.body);

  try {
    const params = {
      TableName: process.env.MEALS_TABLE,
      Key: { mealId },
      UpdateExpression: 'SET',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ReturnValues: 'ALL_NEW',
    };

    Object.keys(updatedMeal).forEach((key) => {
      params.UpdateExpression += ` #${key} = :${key},`;
      params.ExpressionAttributeNames[`#${key}`] = key;
      params.ExpressionAttributeValues[`:${key}`] = updatedMeal[key];
    });

    params.UpdateExpression = params.UpdateExpression.slice(0, -1);

    const result = await dynamodb.update(params).promise();
    const updatedItem = result.Attributes;

    return {
      statusCode: 200,
      body: JSON.stringify(updatedItem),
    };
  } catch (error) {
    console.error('Error updating meal:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};