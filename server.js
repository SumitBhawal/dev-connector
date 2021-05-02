//1. To Import Express
const express = require('express');

//6. Import the DB run file
const connectDB = require('./config/db');

//Path module
const path = require('path');

//2. Run the express moduke
const app = express();
//7. connect database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//5. Basic end request to get request and response
// app.get('/', (req, res) => res.send(' API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set Static Folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//3. Create the port either port 5000 or whichever environment port is used
const PORT = process.env.PORT || 5000;

//4. Run the listener to activate the server
app.listen(PORT, () => console.log(`Server started on port : ${PORT}`));
