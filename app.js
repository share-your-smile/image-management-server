let express = require('express');
let app = express();
let cors = require('cors');

let apiRouter = require('./router/api');

app.use(cors());

app.use(express.json({ extended: true, limit: '20mb'}));

app.use(express.urlencoded({ extended: true, limit: '20mb'}));

app.use('/admin', express.static('test-front'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use('/api', apiRouter);

app.listen(process.env.PORT || 3030, function() {
  console.log('Example app listening on port 3030!');
});