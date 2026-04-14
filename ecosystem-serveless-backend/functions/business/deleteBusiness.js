import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const businessId = event.pathParameters?.id;

    await dynamo.send(
      new DeleteCommand({
        TableName: "Businesses",
        Key: {
          businessId,
        },
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Deleted successfully" }),
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