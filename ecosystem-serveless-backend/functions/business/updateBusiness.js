import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const businessId = event.pathParameters?.id;

    const body = JSON.parse(event.body);

    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "Businesses",
        Key: {
          businessId,
        },
        UpdateExpression:
          "set #name = :name, category = :category, description = :description",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": body.name,
          ":category": body.category,
          ":description": body.description,
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