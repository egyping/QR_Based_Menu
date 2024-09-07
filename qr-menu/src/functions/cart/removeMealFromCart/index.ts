// src/functions/cart/removeMealFromCart/index.ts

import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { cartId, mealId } = JSON.parse(event.body);

  try {
    // Get the existing cart
    const getCartParams = {
      TableName: process.env.CART_TABLE,
      Key: { cartId },
    };
    const getCartResult = await dynamodb.get(getCartParams).promise();
    const cart = getCartResult.Item;

    // Check if the cart exists
    if (!cart) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Cart not found' }),
      };
    }

    // Find the index of the meal in the cart
    const mealIndex = cart.items.findIndex((item) => item.mealId === mealId);

    // If the meal doesn't exist in the cart, return an error
    if (mealIndex === -1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Meal not found in the cart' }),
      };
    }

    // Remove the meal from the cart
    cart.items.splice(mealIndex, 1);

    // Calculate the new total amount
    const newTotalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Update the cart in the database
    const updateCartParams = {
      TableName: process.env.CART_TABLE,
      Key: { cartId },
      UpdateExpression: 'SET #items = :items, #totalAmount = :totalAmount',
      ExpressionAttributeNames: {
        '#items': 'items',
        '#totalAmount': 'totalAmount',
      },
      ExpressionAttributeValues: {
        ':items': cart.items,
        ':totalAmount': newTotalAmount,
      },
      ReturnValues: 'ALL_NEW',
    };
    const updateCartResult = await dynamodb.update(updateCartParams).promise();
    const updatedCart = updateCartResult.Attributes;

    return {
      statusCode: 200,
      body: JSON.stringify(updatedCart),
    };
  } catch (error) {
    console.error('Error removing meal from cart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};