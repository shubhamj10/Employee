require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const controller = require('./controllers/controller');

app.set('view engine','ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('./public'));

const port=process.env.PORT || 3000;


controller(app);

app.listen(port, () => {
    console.log(`Server is running on ${port} `);
});
