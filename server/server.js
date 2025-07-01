const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./Routes/R_User');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());


//MODELS-----------------------------------------------------------------

const M_User = require('./Models/M_User');

//ROUTES-----------------------------------------------------------------
const R_User = require('./Routes/R_User');



//------------------------------------------------------------------------
mongoose.connect('mongodb+srv://username:password@cluster0.rxym2yu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('--- MongoDB connected successfully ---'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/user', R_User);
//app.use('/api/groups', R_Group);
//app.use('/api/posts', R_Posts);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
