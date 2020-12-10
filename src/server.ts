import 'reflect-metadata'; // We need this in order to use @Decorators
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hi there!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log('App is running on port', PORT));
