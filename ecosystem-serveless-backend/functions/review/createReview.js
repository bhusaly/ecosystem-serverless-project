import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { businessId, rating, comment } = body;

    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;

    const review = {
      reviewid: Date.now().toString(),
      businessId,
      userId,
      rating,
      comment,
    };

    await dynamo.send(
      new PutCommand({
        TableName: "Reviews",
        Item: review,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(review),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};