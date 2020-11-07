const S3 = require('../common-s3-access');

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

const setImage = async (req, res) => {
  const s3 = new S3();

  try {
    // クエリでユーザー名を受け取る
    const userId = req.params.userId;
    const timeStamp = getDate();

    const encodedData = req.body.thumbnail;
    const fileData = encodedData.replace(/^data:\w+\/\w+;base64,/, '')
    const decodedFile = new Buffer(fileData, 'base64');
    // ファイルの拡張子(png)
    const fileExtension = encodedData.toString().slice(encodedData.indexOf('/') + 1, encodedData.indexOf(';'))
    // ContentType(image/png)
    const contentType = encodedData.toString().slice(encodedData.indexOf(':') + 1, encodedData.indexOf(';'))
    const hashName = crypto.createHash('md5').update(`${timeStamp}${fileData}`).digest('hex');
    const fileName = [hashName, fileExtension].join('.');

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