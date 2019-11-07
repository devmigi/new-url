import AWS from 'aws-sdk'

export class S3Client {
  protected client: AWS.S3;
  protected bucket:string;

  constructor(s3BucketName:string) {
    this.client = new AWS.S3();
    this.bucket = s3BucketName
  }

  public async save(request: AWS.S3.Types.PutObjectRequest): Promise<AWS.S3.Types.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      this.client.putObject(request, (error, data) => {
        if (error) {
          return reject(error)
        }

        return resolve(data)
      })
    })
  }

  public createRedirect(from: string, to: string) {
    const request: AWS.S3.Types.PutObjectRequest = {
      Bucket: this.bucket,
      Key: from,
      Body: '',
      ACL: 'public-read',
      WebsiteRedirectLocation: to     
    }
    
    return request;
  }
}