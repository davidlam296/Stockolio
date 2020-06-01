require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const routes = require('./routes.js');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

if (process.env.DEV === '1') {
  app.listen(process.env.PORT, () => {
    console.log(`Listening at port ${process.env.PORT}`);
    console.log(`Go to: ${process.env.ROOT}:${process.env.PORT}`);
  });
} else {
  (async () => {
    await app.listen(process.env.PORT, () => {
      console.log(`Listening at port ${process.env.PORT}`);
    });

    require('greenlock-express')
      .init({
        packageRoot: path.join(__dirname, '../'),
        configDir: '../greenlock',
        maintainerEmail: 'david.lam296@gmail.com',
        cluster: false,
      })
      .serve(app);
  })();
}
