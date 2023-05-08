import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand
} from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, ListObjectsCommand} from "@aws-sdk/client-s3";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const s3client = new S3Client({ region: 'us-east-2' })

const SUPPORTED_FILE_TYPES = ["image/png", "image/jpg", "image/gif", "image/jpeg"];

async function generatePreSignedPutUrl(fileName , fileType) {
    if(SUPPORTED_FILE_TYPES.indexOf(fileType) == -1)
    {
        throw new Error(`filetype ${fileType} is not supported`);
    }
    const s3Params = {
        Bucket: 'rsbingo-files',
        Key: fileName,
        ContentType: fileType,
        // ACL: 'bucket-owner-full-control'
    };
    const command = new PutObjectCommand(s3Params);
    return await getSignedUrl(s3client, command, { expiresIn: 120 });
}

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.httpMethod) {
      case "POST":
        let params = JSON.parse(event.body);
        if(event.resource == "/files") {
          const auth = await dynamo.send(
            new GetCommand({
              TableName: 'access_keys',
              Key: {
                key: event.headers.Authorization,
              },
            })
          );
          if(!auth.Item) throw new Error(`not authorized`);
          body = {};
          body.Item = await generatePreSignedPutUrl(params.fileName, params.fileType);
        } else {
          throw new Error(`Unsupported route`);
        }
        break;
      case "GET":
        if(event.resource == "/files") {
          const auth = await dynamo.send(
            new GetCommand({
              TableName: 'access_keys',
              Key: {
                key: event.headers.Authorization,
              },
            })
          );
          if(!auth.Item) throw new Error(`not authorized`);
          var listParams = { 
           Bucket: 'rsbingo-files',
           Prefix: `${event.queryStringParameters.boardId}/${event.queryStringParameters.tileId}/`
          }
          const command = new ListObjectsCommand(listParams);
          const response = await s3client.send(command);
          body = {};
          body.Item = response.Contents;
        } else {
          throw new Error(`Unsupported route`);
        }
        break;
      default:
        throw new Error(`Unsupported route: "${JSON.stringify(event)}"`);
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
