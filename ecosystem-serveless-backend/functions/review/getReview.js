import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173/",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export const handler = async (event) => {
  try {
    
    console.log("EVENT:", JSON.stringify(event));

    const businessId = event.pathParameters?.id;

    if (!businessId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing businessId" }),
      };
    }

    const result = await dynamo.send(
      new ScanCommand({
        TableName: "Reviews",
        FilterExpression: "businessId = :bid",
        ExpressionAttributeValues: {
          ":bid": businessId,
        },
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items || []),
    };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};