const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const crypto = require('crypto');

const allowedOrigins = ['http://localhost:5173', 'http://192.168.3.45:5173']; // Add more as needed

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'], // allowed request methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers in requests
    credentials: true
};

const app = express();
const server = http.createServer(app);
// CORS configuration for Socket.IO
const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Include all necessary origins
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
});

// CORS configuration for Express
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('LocalLink Server is Running');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Real time communication with Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Handling messaging - replace with your own logic
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        io.emit('message', msg); // Broadcasting message to all clients
    });
});

// End-to-end Encryption
const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

function decrypt(hash) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrypted.toString();
}

// Handling file uploads
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('File uploaded:', req.file);
    res.send('File uploaded successfully.');
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    res.download(filepath);
});