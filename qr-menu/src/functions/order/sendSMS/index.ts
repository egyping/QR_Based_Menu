import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';

const sns = new SNS();


export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  try {
    for (const record of event.Records) {
      if (record.eventName === 'MODIFY') {
        const newImage = record.dynamodb?.NewImage;

        if (newImage) {
          // const orderId = newImage.orderId.S;
          const customerMobileNumber = newImage.customerMobileNumber.S;
          const orderStatus = newImage.status.S;

          const smsMessage = `Your order has been updated to status: ${orderStatus}`;

          // await sendSMS(customerMobileNumber, smsMessage);
          await sendSMS();
        }
      }
    }
  } catch (error) {
    console.error('Error processing DynamoDB stream event:', error);
  }
};

// async function sendSMS(phoneNumber: string, message: string) {

async function sendSMS() {
    const params = {
      Message: "Your order status changed",
      PhoneNumber: "+xxxxxx",
    };
  
    try {
      await sns.publish(params).promise();
      // onsole.log(`SMS sent successfully to ${phoneNumber}`);
      console.log(`SMS sent successfully`);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }