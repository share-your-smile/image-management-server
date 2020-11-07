const S3 = require('../common-s3-access');

// GET api/:userId/image/:fileName
const getImage = async (req, res) => {
  const s3 = new S3();

  try {
    const userId = res.params.userId;
    const fileName = res.params.fileName;

    const str = fileName.split('.');
    const resType = str[str.length - 1];

    const resBlob = await s3.getImage(userId, fileName);

    res.status(200);
    res.type(resType);
    res.send(resBlob);
  } catch(err) {
    res.status(400);
    res.send({
      message: err
    });
  }

};

module.exports = getImage;