

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    console.log(event.body)
    const body = JSON.parse(event.body);

    const item = {
      businessId: Date.now().toString(),
      name: body.name,
      category: body.category,
      description: body.description,
      userId: event.requestContext.authorizer.jwt.claims.sub, 
    }
    
    await dynamo.send(
      new PutCommand({
        TableName: "Businesses",
        Item: item,
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}