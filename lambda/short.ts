import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';
import 'source-map-support/register';
import nanoid from 'nanoid';


import { S3Client } from '../services/s3-client';
import { DynamoDB } from 'aws-sdk'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  const s3Client = new S3Client(process.env.BUCKET!);

  const data = JSON.parse(event.body|| '{}');
  const fullUrl = data.url;
  const shortUrl =  nanoid(7);
  
  const s3PutRequest = s3Client.createRedirect(shortUrl, fullUrl);
  // const s3Response = await s3Client.save(s3PutRequest);
  await s3Client.save(s3PutRequest);  
  

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.URLS_TABLE!,
    Item: newUrl
  }

  await new Promise((resolve, reject) => {
    new DynamoDB.DocumentClient().put(params, (error, data) => {
      if (error) {
        console.log("error in saving to db:")
        return reject(error)
      }
      console.log("success in saving to db:")
      return resolve(data)
    })
  })


  const response = {
    message: 'Success',
    data: {
      'fullUrl': fullUrl,
      'shortUrl': shortUrl
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response, null, 2)
  };

}