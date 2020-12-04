const express = require('express');
const app = express();
const aws = require('aws-sdk');
require('dotenv').config();

aws.config.region = 'ap-northeast-1';

const s3 = new aws.S3();

const getlist = async () => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Prefix: 'media'
  }

  const lists = [];

  const res = await s3.listObjectsV2(params).promise();

  res.Contents.map(v => v.Key).forEach(v => {
    if (v.indexOf('jpg') !== -1 || 
        v.indexOf('jpeg') !== -1 ||
        v.indexOf('png') !== -1) {
      lists.push(v);
    }
  })

  console.log(lists);
};

const getImage = async () => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: 'media/github-logo.png'
  }

  const lists = [];

  const res = await s3.getObject(params).promise();

  console.log(res.ContentLength);
  console.log(res.ContentType);

  console.log(lists);
};

const getDate = () => {
  const date = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
  const tmp1 = date.split('-');
  const tmp2 = tmp1[2].split(' ');
  const tmp3 = tmp2[1].split(':');

  const year = tmp1[0];
  const month = tmp1[1];
  const day = tmp2[0];
  const hour = tmp3[0];
  const minute = tmp3[1];
  const second = tmp3[2];

  return year + month + day + hour + minute + second;
}

console.log(getDate());

getlist();

// app.use(express.json());
// app.get('/api/image/:fileName', async function(req, res) {

//   console.log(Date.now());

//   console.log('api/image called');
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `media/${req.params.fileName}`
//   }

//   const lists = [];

//   const response = await s3.getObject(params).promise();

//   console.log(response.ContentLength);
//   console.log(response.ContentType);
//   res.status(200);
//   res.type('png');
//   res.send(response.Body);
// })


// // debug
// app.use('/test', express.static('test-front'));

// app.listen(3003, function() {
//   console.log('3003 port open');
// });