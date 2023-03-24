const express = require('express')
const app = express()

const axios = require('axios');


const bodyParser = require('body-parser');
app.use(bodyParser.json());


const PORT = process.env.PORT || 3001


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




app.get('/memoapp', async (req, res) => {
  try {
    const response = await axios.get('https://challenge-server.tracks.run/memoapp/category');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
