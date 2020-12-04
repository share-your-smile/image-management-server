let express = require('express');
let app = express();
let cors = require('cors');

let apiRouter = require('./router/api');

app.use(cors());

app.use(express.json());

app.use('/admin', express.static('test-front'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use('/api/:userId', apiRouter);

app.listen(process.env.PORT || 3030, function() {
  console.log('Example app listening on port 3030!');
});