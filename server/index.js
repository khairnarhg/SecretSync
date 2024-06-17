const crypto = require('crypto');
const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io');

const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/users');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true, 
  }));

app.use(express.json());


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

const url = 'mongodb+srv://hgkhairnar255:15jUfeGkxy3wNJtc@cluster0.nbxft91.mongodb.net/ss1'

mongoose.connect(url, {}).then(() => {
    console.log('db connected')
});
app.get('/api/users', async (req, res) => {
    console.log('Received GET request at /api/users');
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/signup', async (req,res)=>{
    console.log('bande ka info milgaya bhai');
    try{
        const {name, email, password}= req.body;
        const unum= generateUniqueNumber();
        const newUser= new User({name, email, unum, password});
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', unum });
    }catch(e){
        console.log('error while signup', e);
    }
})



let connectedClients = 0;

io.on("connection", (socket) => {

    connectedClients++;
    console.log('User connected:', connectedClients);
    console.log("Id:", socket.id);

    if (connectedClients === 2) {
        

        console.log('Two clients connected. Proceeding with shared secret computation...');

        const A = crypto.createDiffieHellman(1024);
        const AKeys = A.generateKeys();
        const APublicKey = A.getPublicKey('hex');

        const B = crypto.createDiffieHellman(A.getPrime(), A.getGenerator());
        const BKeys = B.generateKeys();
        const BPublicKey = B.getPublicKey('hex');

        const ASecret = A.computeSecret(BPublicKey, 'hex', 'hex');
        const BSecret = B.computeSecret(APublicKey, 'hex', 'hex');

        const sharedSecretBuffer = Buffer.from(ASecret, 'hex');

        const salt = Buffer.alloc(32);
        const info = Buffer.from('AES-GCM Key Derivation', 'utf-8');

        const prk = hkdfExtract(sharedSecretBuffer, salt);

        const encryptionKey = hkdfExpand(prk, Buffer.from('encryption key', 'utf-8'), 16);
        const authKey = hkdfExpand(prk, Buffer.from('authentication key', 'utf-8'), 12);

        const EncryptionKey = encryptionKey.toString('hex');
        const Hashsubkey = authKey.toString('hex');

        console.log('Shared secret computation completed.');
        console.log('Encryption Key:', EncryptionKey);
        console.log('Hash Subkey:', Hashsubkey);

        
        io.emit("encryption_keys", { encryptionKey});
    }

    socket.on('message', (data) => {
        console.log('Message received:', data);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        connectedClients--;
        console.log('Number of connected clients:', connectedClients);
    });
});




function hkdfExtract(secret, salt) {
    return crypto.createHmac('sha256', salt)
        .update(secret)
        .digest();
}

function hkdfExpand(prk, info, length) {
    const hash = crypto.createHmac('sha256', prk);
    const iterations = Math.ceil(length / 32); 
    let result = Buffer.alloc(0);
  
    for (let i = 1; i <= iterations; i++) {
      const currentIteration = hash.update(Buffer.concat([result, info, Buffer.from([i])])).digest();
      result = Buffer.concat([result, currentIteration]);
    }
  
    return result.slice(0, length);
}

const PORT = 5000;
server.listen(PORT, () => {
    
    console.log(`server is running at ${PORT}`);
});
