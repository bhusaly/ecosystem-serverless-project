import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const reviewid = event.pathParameters?.id;
    const body = JSON.parse(event.body);

    const { businessId, comment } = body;

    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "Reviews",
        Key: {
          businessId,
          reviewid,
        },
        UpdateExpression: "set #c = :comment",
        ExpressionAttributeNames: {
          "#c": "comment",
        },
        ExpressionAttributeValues: {
          ":comment": comment,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};