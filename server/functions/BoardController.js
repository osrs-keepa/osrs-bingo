import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "boards";

const SAMPLE_BOARD = {
    id: "e6e2ef15-6411-43af-88ea-ff08258e1e1f",
    name: "Gatekeepr Bingo 2023",
    totalPoints: 0,
    size: 3,
    tiles: [
      {
        id: 196562986317,
        name: "Raids Weapon",
        description: "Obtain a weapon drop from any of the 3 raids.",
        icon: "tbow",
        currentPoints: 0,
        possiblePoints: 250
      },
      {
        id: 196562986318,
        name: "Barrows Set",
        description: "Obtain a full barrows set.",
        icon: "dharok",
        currentPoints: 0,
        possiblePoints: 120
      },
      {
        id: 196562986319,
        name: "Collectively get 4 million mining xp.",
        description: "Mining",
        icon: "pickaxe",
        currentPoints: 0,
        possiblePoints: 345
      },
      {
        id: 196562986320,
        name: "Big Fish",
        description: "Obtain a big bass, big swordfish, and big shark.",
        icon: "big_shark",
        currentPoints: 0,
        possiblePoints: 140
      },
      {
        id: 196562986321,
        name: "Zulrah",
        description: "Obtain a magic fang, serpentine visage, and tanz fang.",
        icon: "zulrah",
        currentPoints: 0,
        possiblePoints: 130
      },
      {
        id: 196562986322,
        name: "Trouble Brewing",
        description: "score 30 points in 1 trouble brewing game.",
        icon: "rum",
        currentPoints: 0,
        possiblePoints: 100
      },
      {
        id: 196562986323,
        name: "Champion Scroll",
        description: "Obtain 3 different champion scrolls",
        icon: "champion_scroll",
        currentPoints: 0,
        possiblePoints: 75
      },
      {
        id: 196562986324,
        name: "Gambles",
        description: "Do 50 high gambles.",
        icon: "penance_queen",
        currentPoints: 0,
        possiblePoints: 180
      },
      {
        id: 196562986325,
        name: "Runecrafting",
        description: "Collectively get 2m runecrafting xp.",
        icon: "runecraft",
        currentPoints: 0,
        possiblePoints: 110
      }
    ]
  };

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  
  try {
    switch (event.httpMethod) {
      // Get Board
      case "GET":
        if(event.resource == "/boards/{id}") {
          const auth = await dynamo.send(
            new GetCommand({
              TableName: 'access_keys',
              Key: {
                key: event.headers.Authorization,
              },
            })
          );
          if(!auth.Item) throw new Error(`not authorized`);
          body = await dynamo.send(
            new GetCommand({
              TableName: tableName,
              Key: {
                id: event.pathParameters.id,
              },
            })
            );
          body = body.Item;
        } else {
          throw new Error(`Unsupported route`);
        }
      break;
      // Create Board
      // Right now this is just a sample board, don't use it
      case "PUT":
        if(event.resource == "/boards/{id}") {
          const auth = await dynamo.send(
            new GetCommand({
              TableName: 'access_keys',
              Key: {
                key: event.headers.Authorization,
              },
            })
          );
          if(!auth.Item || auth.Item.role !== "admin") throw new Error(`not authorized`);
          body = await dynamo.send(
            new PutCommand({
              TableName: tableName,
              Item: SAMPLE_BOARD,
            })
            );
          body = body.Item;
        } else {
          throw new Error(`Unsupported route`);
        }
        break;
      default:
        throw new Error(`Unsupported action ${event.httpMethod} ${event.resource}`);
    }
  } catch (err) {
    statusCode = err.message == "not authorized" ? 401 : 400;
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
