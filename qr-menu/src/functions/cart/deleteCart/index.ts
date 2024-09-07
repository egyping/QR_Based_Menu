// src/functions/cart/deleteCart/index.ts

import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { cartId } = JSON.parse(event.body);

  try {
    // Check if the cart exists
    const getCartParams = {
      TableName: process.env.CART_TABLE,
      Key: { cartId },
    };
    const getCartResult = await dynamodb.get(getCartParams).promise();
    const cart = getCartResult.Item;

    if (!cart) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Cart not found' }),
      };
    }

    // Delete the cart from the database
    const deleteCartParams = {
      TableName: process.env.CART_TABLE,
      Key: { cartId },
    };
    await dynamodb.delete(deleteCartParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Cart deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};