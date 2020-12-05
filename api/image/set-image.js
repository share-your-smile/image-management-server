const S3 = require('../common-s3-access');

const setNum = (numString) => {
  if (numString.length === 1) {
    return `0${numString}`;
  } else {
    return numString;
  }
}

const getDate = () => {
  console.log('get date');
  const jstOffset = 9 * 60;
  const date = new Date();
  date.setTime(date.getTime() + jstOffset * 60 * 1000);

  // const date = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
  
  const tmp1 = date.split('-');
  const tmp2 = tmp1[2].split(' ');
  const tmp3 = tmp2[1].split(':');

  const year = setNum(tmp1[0]);
  const month = setNum(tmp1[1]);
  const day = setNum(tmp2[0]);
  const hour = setNum(tmp3[0]);
  const minute = setNum(tmp3[1]);
  const second = setNum(tmp3[2]);
  
  return year + month + day + hour + minute + second;
}

const setImage = async (req, res) => {
  const s3 = new S3();

  try {
    // クエリでユーザー名を受け取る
    const userId = req.params.userId;
    const timeStamp = getDate();

    const encodedData = req.body.image;
    const posterName = req.body.poster;

    const fileData = encodedData.replace(/^data:\w+\/\w+;base64,/, '')
    const decodedFile = new Buffer.from(fileData, 'base64');
    // ファイルの拡張子(png)
    const fileExtension = encodedData.toString().slice(encodedData.indexOf('/') + 1, encodedData.indexOf(';'));
    // // ContentType(image/png)
    const contentType = encodedData.toString().slice(encodedData.indexOf(':') + 1, encodedData.indexOf(';'));
    const fileName = `${timeStamp}_${posterName}.${fileExtension}`;

    await s3.uploadImage(userId, decodedFile, contentType, fileName);

    res.status(200);
    res.send({
      result: 'OK'
    });
  } catch (err) {
    res.status(400);
    res.send({
      message: err
    });
  }
}

module.exports = setImage;