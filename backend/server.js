const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose  = require('mongoose');
const connectDB = require('./config/db');
const http = require('http');
const {Server} = require ('socket.io');

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
app.use((err,req,res,next) => {
    const statuscode =  res.statuscode === 200? 500 : statuscode;
    res.status(statuscode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
})

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`⚡User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(` ❌ User disconnected: ${socket.id}`);
    });
});

app.set('io', io);

const PORT = 4000;
server.listen(PORT, () =>{
     console.log(`Server blasting off on port ${PORT} with real time sockets embedded`);
    });
