import type { AWS } from '@serverless/typescript'


interface Authorizer {
  name: string;
  type: string;
  arn: {
    'Fn::GetAtt': string[];
  };
}
const authorizer: Authorizer = {
  name: 'authorizer',
  type: 'COGNITO_USER_POOLS',
  arn: { 'Fn::GetAtt': ['CognitoUserPool', 'Arn'] },
};

const corsSettings = {
  headers: [
      // Specify allowed headers
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'X-Amz-Security-Token',
      'X-Amz-User-Agent',
    ],
    allowCredentials: false,
}

const functions: AWS['functions'] = {
  getMeals: {
    handler: 'src/functions/getMeals/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'meals',
        },
      },
    ],
  },

  login: {
    handler: 'src/functions/admin/auth/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'auth/login',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },
  listMeals: {
    handler: 'src/functions/admin/listMeals/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'allmeals',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },
  createMeal: {
    handler: 'src/functions/admin/createMeal/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'meals',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },

  updateMeal: {
    handler: 'src/functions/admin/updateMeal/index.handler',
    events: [
      {
        http: {
          method: 'put',
          path: 'meals/{mealId}',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },

  // Cart APIs \\
  addToCart: {
    handler: `src/functions/cart/addToCart/index.handler`,
    events: [
      {
        http: {
          method: "post",
          path: "cart",
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },

  increaseMealQuantity: {
    handler: 'src/functions/cart/increaseMealQuantity/index.handler',
    events: [
      {
        http: {
          method: 'put',
          path: 'cart/increase-quantity',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },

  removeMealFromCart: {
    handler: 'src/functions/cart/removeMealFromCart/index.handler',
    events: [
      {
        http: {
          method: 'put',
          path: 'cart/remove-meal',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },

  deleteCart: {
    handler: 'src/functions/cart/deleteCart/index.handler',
    events: [
      {
        http: {
          method: 'delete',
          path: 'cart',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },
  
// Create Order
createOrder: {
  handler: 'src/functions/order/createOrder/index.handler',
  events: [
    {
      http: {
        method: 'post',
        path: 'order',
        cors: corsSettings,
        authorizer,
      },
    },
  ],
},

changeOrderStatus: {
  handler: 'src/functions/order/changeOrderStatus/index.handler',
  events: [
    {
      http: {
        method: 'put',
        path: 'order/{orderId}/status',
        cors: corsSettings,
        authorizer,
      },
    },
  ],
},


};
export default functions;