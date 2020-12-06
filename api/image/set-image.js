const S3 = require('../common-s3-access');

const setNum = (numString) => {
  if (numString.length === 1) {
    return `0${numString}`;
  } else {
    return numString;
  }
}

const getDate = () => {
  const jstOffset = 9 * 60;
  const date = new Date();
  // date.setTime(date.getTime() + jstOffset * 60 * 1000);

  const jstDate = date.toLocaleString('ja-jp');

  console.log(jstDate);

  // const date = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });

  let tmp1, tmp2, tmp3, tmp4;
  let year, month, day, hour, minute, second;

  if (jstDate.indexOf('-') != -1) {
    // YYYY-MM-DD HH:MM:SS
    tmp1 = jstDate.split('-');
    console.log(tmp1);
    tmp2 = tmp1[2].split(' ');
    tmp3 = tmp2[1].split(':');

    year = setNum(tmp1[0]);
    month = setNum(tmp1[1]);
    day = setNum(tmp2[0]);
    hour = setNum(tmp3[0]);
    minute = setNum(tmp3[1]);
    second = setNum(tmp3[2]);
  } else {
    // MM/DD/YYYY, HH:MM:SS AMorPM
    tmp1 = jstDate.split('/');
    tmp2 = tmp1[2].split(',');
    tmp3 = tmp2[1].split(' ');
    tmp4 = tmp3[1].split(':');

    year = setNum(tmp2[0]);
    month = setNum(tmp1[0]);
    day = setNum(tmp1[1]);
    hour = setNum(tmp4[0]);
    minute = setNum(tmp4[1]);
    second = setNum(tmp4[2]);

    if (tmp3[2] === 'PM') {
      let numHour = parseInt(hour);
      numHour = numHour + 12;
      hour = numHour.toString();
    }
  }

  
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