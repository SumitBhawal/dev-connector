//1. To Import Express
const express = require('express');
//2. Run the express moduke
const app = express();

//5. Basic end request to get request and response
app.get('/', (req, res) => res.send(' API Running'));

//3. Create the port either port 5000 or whichever environment port is used
const PORT = process.env.PORT || 5000;

//4. Run the listener to activate the server
app.listen(PORT, () => console.log(`Server started on port : ${PORT}`));
