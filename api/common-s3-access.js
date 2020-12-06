const aws = require('aws-sdk');

require('dotenv').config();

aws.config.region = 'ap-northeast-1';

module.exports = class CommonS3Access {
  constructor() {
    this.S3_BUCKET = process.env.S3_BUCKET;
    this.S3_SLIDE_BUCKET = process.env.S3_SLIDE_BUCKET;
  }

  // 画像データを格納する
  async uploadImage(userId, decodedFile, contentType, fileName) {
    const params = {
      Body: decodedFile,
      Bucket: this.S3_BUCKET,
      Key: `${userId}/${fileName}`,
      ContentType: contentType
    }
    const s3 = new aws.S3();
    return s3.putObject(params).promise()
      .catch((err) => { throw new Error('upload failure')}) 
  }

  // 画像データの一覧を取得する
  async getImagesList(userId) {
    const params = {
      Bucket: this.setBucket(userId),
      Prefix: `${userId}`,
    }

    const lists = [];

    const s3 = new aws.S3();
    const res = await s3.listObjectsV2(params).promise();

    res.Contents.map(v => v.Key).forEach(v => {
      if (v.indexOf('jpg') !== -1 || 
          v.indexOf('jpeg') !== -1 ||
          v.indexOf('png') !== -1) {
        lists.push(v);
      }
    })
    
    return lists;
  }

  // 画像データを取得する
  async getImage(userId, fileName) {
    const params = {
      Bucket: this.setBucket(userId),
      Key:`${userId}/${fileName}`
    }
    const s3 = new aws.S3();
    return await s3.getObject(params).promise();
  }

  setBucket(userId) {
    if (userId.indexOf('resized-') !== -1) {
      return this.S3_SLIDE_BUCKET;
    } else {
      return this.S3_BUCKET;
    }
  }
}