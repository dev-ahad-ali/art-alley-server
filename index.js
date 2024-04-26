const express = require('express');
const cors = require('cors');

//config
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Art Alley server is running');
});

app.listen(port, () => {
    console.log(`Art Alley server is listening at ${port}`);
});
