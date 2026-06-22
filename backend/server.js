const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config(); //loads environment files from process.env
connectDB(); //connects to mongoDB database
const app = express();
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
//global middlewares
app.use(cors()); //allow frontend framework to talk to backend server using different port
app.use(express.json()); //allow express routes to read json body data sent by clients 
app.get('/', (req,res) => {
    res.send('API is running successfully 🌿');
});
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server blasting off on port ${PORT}`));
