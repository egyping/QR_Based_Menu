import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";

const dynamodb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { customerMobileNumber, mealId, quantity } = JSON.parse(event.body);

  try {
    // Check if a cart exists for the customer
    const getCartParams = {
      TableName: process.env.CART_TABLE,
      IndexName: "CustomerMobileNumberIndex",
      KeyConditionExpression: "customerMobileNumber = :customerMobileNumber",
      ExpressionAttributeValues: {
        ":customerMobileNumber": customerMobileNumber,
      },
    };
    const getCartResult = await dynamodb.query(getCartParams).promise();

    let cartId;
    let cart;

    if (getCartResult.Items.length === 0) {
      // If no cart exists, create a new one
      cartId = uuid();
      cart = {
        cartId,
        customerMobileNumber,
        items: [],
        totalAmount: 0,
        createdAt: new Date().toISOString(),
      };
    } else {
      // If a cart already exists, use the existing cart
      cart = getCartResult.Items[0];
      cartId = cart.cartId;
    }

    // Get the meal details from the Meals table
    const getMealParams = {
      TableName: process.env.MEALS_TABLE,
      Key: { mealId },
    };
    const getMealResult = await dynamodb.get(getMealParams).promise();
    const meal = getMealResult.Item;

    // Check if the meal exists
    if (!meal) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Meal not found" }),
      };
    }

    // Check if the meal already exists in the cart
    const existingMealIndex = cart.items.findIndex(
      (item) => item.mealId === mealId
    );

    if (existingMealIndex !== -1) {
      // If the meal already exists, update its quantity
      cart.items[existingMealIndex].quantity += quantity;
    } else {
      // If the meal doesn't exist, add it to the cart
      cart.items.push({
        mealId,
        quantity,
        price: meal.price,
      });
    }

    // Calculate the total amount of the cart
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save the updated cart
    const putCartParams = {
      TableName: process.env.CART_TABLE,
      Item: cart,
    };
    await dynamodb.put(putCartParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
    };
  } catch (error) {
    console.error("Error adding meal to cart:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};