const express = require('express')
const sequelize = require('./util/database');
const bodyParser = require('body-parser')
const LibraryRouter = require('./routes/library')
const cors = require('cors');

const app = express();
// const jsonParser = bodyParser.json();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/library',LibraryRouter);

sequelize
    .sync()
    .then(() => {
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch((err) => {
        console.log(err);
    });
