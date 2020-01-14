const express = require('express');

const app = express();

const routes = require('./routes');

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', routes);

app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not found' });
});

app.listen(8080, () => {
  console.log('connected to port 8080');
});
