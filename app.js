let express = require('express');
let app = express();
let cors = require('cors');

let apiRouter = require('./router/api');

app.use(cors());

app.use(express.json());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use('/api/:userId', apiRouter);

app.listen(3010, function() {
  console.log('Example app listening on port 3000!');
});