let express = require('express');
const getImage = require('../api/image/get-image');
const setImage = require('../api/image/set-image');
const getList = require('../api/list/get-list');
let router = express.Router();

// GET api/:userId/image/:fileName
router.get('/:userId/image/:fileName', getImage);

// POST api/:userId/image/:fileName
router.post('/:userId/image', setImage);

// GET api/:userId/list
router.get('/:userId/list',getList);

module.exports = router;