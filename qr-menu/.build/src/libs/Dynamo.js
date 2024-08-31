import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand, DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand, } from '@aws-sdk/lib-dynamodb';
const ddbClient = new DynamoDBClient({});
const isTest = process.env.JEST_WORKER_ID;
const isServerlessOffline = process.env.IS_OFFLINE;
const config = {
    convertEmptyValues: true,
    region: process.env.region || 'eu-central-1',
    ...(isTest && {
        endpoint: 'http://localhost:8000',
        sslEnabled: false,
        region: 'local-env',
    }),
    ...(isServerlessOffline && {
        endpoint: 'http://localhost:8005',
    }),
};
const Dynamo = {
    get: async ({ pkKey = 'id', pkValue, skKey, skValue, tableName, }) => {
        const params = {
            TableName: tableName,
            Key: {
                [pkKey]: pkValue,
            },
        };
        if (skKey && skValue) {
            params.Key[skKey] = skValue;
        }
        const res = await ddbClient.send(new GetCommand(params));
        return res.Item;
    },
    write: async ({ data, tableName, }) => {
        const params = {
            TableName: tableName,
            Item: { ...data },
        };
        await ddbClient.send(new PutCommand(params));
        return params.Item;
    },
    delete: async ({ pkKey = 'id', pkValue, skKey, skValue, tableName, }) => {
        const params = {
            TableName: tableName,
            Key: {
                [pkKey]: pkValue,
            },
            ExpressionAttributeNames: {
                '#pkKey': pkKey,
            },
            ExpressionAttributeValues: {
                ':pkValue': pkValue,
            },
            ConditionExpression: `#pkKey = :pkValue`,
        };
        if (skKey && skValue) {
            params.Key[skKey] = skValue;
        }
        return await ddbClient.send(new DeleteCommand(params));
    },
    query: async ({ tableName, index, pkKey = 'pk', pkValue, skKey, skMin, skValue, skMax, skBeginsWith, limit, startFromRecord, }) => {
        if (skKey && !(skMin || skMax || skValue || skBeginsWith)) {
            throw Error('Need a skMin, skMax, skBeginsWith or skValue when a skKey is provided');
        }
        const skminExp = skMin ? `${skKey} > :skvaluemin` : '';
        const skmaxExp = skMax ? `${skKey} < :skvaluemax` : '';
        const skEqualsExp = skValue ? `${skKey} = :skkeyvalue` : '';
        const skBeginsWithExp = skBeginsWith ? `begins_with (${skKey}, :skBeginsWith)` : '';
        const skKeyExp = skMin && skMax
            ? `${skKey} BETWEEN :skvaluemin AND :skvaluemax`
            : skminExp || skmaxExp || skEqualsExp || skBeginsWithExp;
        let params = {
            TableName: tableName,
            IndexName: index,
            KeyConditionExpression: `${pkKey} = :pkvalue${skKey ? ` AND ${skKeyExp}` : ''}`,
            ExpressionAttributeValues: {
                ':pkvalue': pkValue,
            },
            Limit: limit,
            ExclusiveStartKey: startFromRecord ? startFromRecord : undefined,
        };
        if (!skKey) {
            delete params.ExpressionAttributeValues[':skvaluemax'];
            delete params.ExpressionAttributeValues[':skvaluemin'];
        }
        else {
            if (skMin) {
                params.ExpressionAttributeValues[':skvaluemin'] = skMin;
            }
            if (skMax) {
                params.ExpressionAttributeValues[':skvaluemax'] = skMax;
            }
            if (skValue) {
                params.ExpressionAttributeValues[':skkeyvalue'] = skValue;
            }
            if (skBeginsWith) {
                params.ExpressionAttributeValues[':skBeginsWith'] = skBeginsWith;
            }
        }
        const command = new QueryCommand(params);
        const res = await ddbClient.send(command);
        return res.Items;
    },
    update: async ({ tableName, pkKey, pkValue, skKey, skValue, updateKey, updateValue, }) => {
        const params = {
            TableName: tableName,
            Key: { [pkKey]: pkValue },
            UpdateExpression: `set #updateKey = :updateValue`,
            ExpressionAttributeValues: {
                ':updateValue': updateValue,
                ':pkValue': pkValue,
            },
            ExpressionAttributeNames: {
                '#updateKey': updateKey,
                '#pkKey': pkKey,
            },
            ReturnValues: 'ALL_NEW',
            ConditionExpression: `#pkKey = :pkValue`,
        };
        if (skKey && skValue) {
            params.Key[skKey] = skValue;
        }
        const res = await ddbClient.send(new UpdateCommand(params));
        return res.Attributes;
    },
    batchWrite: async ({ tableName, tableData, }) => {
        const formattedRequestItems = tableData.map((item) => ({
            PutRequest: {
                Item: item,
            },
        }));
        return batch25(formattedRequestItems, tableName);
    },
};
export default Dynamo;
const batch25 = async (requests, tableName) => {
    let batchNo = 0;
    while (requests.length > 0) {
        batchNo += 1;
        console.log({ batchNo });
        const batch = requests.splice(0, 25);
        const params = {
            RequestItems: {
                [tableName]: batch,
            },
        };
        await ddbClient.send(new BatchWriteCommand(params));
    }
    return;
};
//# sourceMappingURL=Dynamo.js.map