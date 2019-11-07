import AWS from 'aws-sdk'
import moment from 'moment';
import 'moment-timezone';

export class DBClient {
  protected client: AWS.DynamoDB.DocumentClient;
  protected table:string;

  constructor(tableName:string) {
    this.client = new AWS.DynamoDB.DocumentClient();
    this.table = tableName
  }


  public createUrlItem(from: string, to: string) : AWS.DynamoDB.DocumentClient.PutItemInput{
    let datetime = moment().tz("Asia/Kolkata").format('YYYY-MM-DD  HH:mm:ss');

    const newUrl:Url = {
        shortUrl: from,
        fullUrl: to,
        hits:  0,
        createdAt: datetime,
        updatedAt: datetime
    };

    const item: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: process.env.URLS_TABLE!,
        Item: newUrl
    }
    
    return item;
  }


  public async save(item: AWS.DynamoDB.DocumentClient.PutItemInput){
    
    this.client.put(item, (error, _data) => {
        if (error) {
            console.log("error in saving to db:")
        }
        else{
            console.log("success in saving to db:")
            return true;
        }
    });

    return false;
  }

}