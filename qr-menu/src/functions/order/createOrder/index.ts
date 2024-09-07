
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { cart, customerName, customerMobileNumber, tableNumber } = JSON.parse(event.body);

  try {
    // Check if the cart exists
    const getCartParams = {
      TableName: process.env.CART_TABLE,
      Key: { cartId: cart.cartId },
    };
    const getCartResult = await dynamodb.get(getCartParams).promise();
    if (!getCartResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Cart not found' }),
      };
    }

    const orderId = uuid();
    const createdAt = Date.now();

    const order = {
      orderId,
      ...cart,
      customerName,
      customerMobileNumber,
      tableNumber,
      status: 'NEW',
      createdAt,
    };

    // Save the order to the database
    const putOrderParams = {
      TableName: process.env.ORDERS_TABLE,
      Item: order,
    };
    await dynamodb.put(putOrderParams).promise();

    // Create a new customer record if it doesn't exist
    const getCustomerParams = {
      TableName: process.env.CUSTOMERS_TABLE,
      Key: { mobileNumber: customerMobileNumber },
    };
    const getCustomerResult = await dynamodb.get(getCustomerParams).promise();
    if (!getCustomerResult.Item) {
      const putCustomerParams = {
        TableName: process.env.CUSTOMERS_TABLE,
        Item: {
          mobileNumber: customerMobileNumber,
          name: customerName,
          createdAt,
        },
      };
      await dynamodb.put(putCustomerParams).promise();
    }

    // Delete the cart after creating the order
    const deleteCartParams = {
      TableName: process.env.CART_TABLE,
      Key: { cartId: cart.cartId },
    };
    await dynamodb.delete(deleteCartParams).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(order),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';

    if (error.code === 'ConditionalCheckFailedException') {
      statusCode = 404;
      errorMessage = 'Cart not found';
    }

    return {
      statusCode,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};