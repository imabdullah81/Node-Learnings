const express = require('express');
const app = express();

app.get('/', (req, res) => {
  return res.send('Hello ' + req.query.myname + '!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
module.exports = app;