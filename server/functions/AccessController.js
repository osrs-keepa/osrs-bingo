import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "access_keys";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.httpMethod) {
      case "GET":
        if(event.resource == "/keys/{id}") {
          body = await dynamo.send(
            new GetCommand({
              TableName: tableName,
              Key: {
                key: event.pathParameters.id,
              },
            })
          );
          body = body.Item;
        } else {
          throw new Error(`Unsupported route`);
        }
        break;
      default:
        throw new Error(`Unsupported route: "${JSON.stringify(event)}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
