import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognito = new CognitoIdentityServiceProvider();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { email, password } = JSON.parse(event.body || '{}');
  console.log('Login request:', JSON.stringify(event, null, 2));

  try {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const response = await cognito.initiateAuth(params).promise();
    const idToken = response.AuthenticationResult?.IdToken;

    return {
      statusCode: 200,
      body: JSON.stringify({ idToken }),
    };
  } catch (error) {
    console.error('Login error:', error);

    if (error.code === 'UserNotFoundException') {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    if (error.code === 'NotAuthorizedException') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }

    if (error.code === 'UserNotConfirmedException') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'User account is not confirmed' }),
      };
    }

    // Handle other Cognito-specific errors
    if (error.code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }),
      };
    }

    // Handle unknown errors
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};