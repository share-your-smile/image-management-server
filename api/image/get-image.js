const { response } = require('express');
const S3 = require('../common-s3-access');

// GET api/:userId/image/:fileName
const getImage = async (req, res) => {
  const s3 = new S3();

  try {
    const userId = req.params.userId;
    const fileName = req.params.fileName;

    const response = await s3.getImage(userId, fileName);

    res.status(200);
    res.type(response.ContentType);
    res.send(response.Body);
  } catch(err) {
    res.status(400);
    res.send({
      message: err
    });
  }

};

module.exports = getImage;