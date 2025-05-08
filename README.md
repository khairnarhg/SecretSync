#  SecretSync – Secure End-to-End Encrypted Chat

**SecretSync** is a real-time, secure messaging platform built for encrypted peer-to-peer communication. It combines **Diffie-Hellman key exchange** and **AES-GCM encryption** to provide robust end-to-end message confidentiality — making it ideal for sensitive or private conversations.

---

## 🛡 Key Features

### 🔑 End-to-End Encryption
- **Diffie-Hellman Key Exchange (1024-bit)** for secure, ephemeral key generation
- **AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)** for authenticated encryption & decryption
- No keys or messages are stored or logged on the server

### 💬 Real-Time Chat
- Built with **WebSockets** for instant, bidirectional communication
- Fully encrypted messages in transit — readable **only by the intended recipient**

###  Cryptography Highlights
- 1024-bit Diffie-Hellman for secure shared secret exchange
- AES-256-GCM for confidentiality and integrity
- Optional support for larger keys (2048/4096-bit) on higher-end systems

###  Developer-Friendly Design

- Easily extendable to include image/file encryption
- Optional authentication layer can be added for session security

---

## ⚙️ Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | React.js                 |
| Backend    | Node.js + Express        |
| Realtime   | WebSockets (ws)          |
| Crypto     | `crypto` (Node) |

---

## How It Works
Two users initiate a connection.

A Diffie-Hellman key exchange takes place securely between both clients (via WebSocket handshake).

Both derive a shared secret used to encrypt and decrypt messages.

Each message is:

Encrypted using AES-GCM with a unique nonce

Transmitted over WebSocket

Decrypted client-side using the shared key

❗ Even the server cannot read the messages — only the sender and receiver hold the decryption key.

---

🛠️ Future Improvements

 - Multi-user chat rooms
 - Forward secrecy via ephemeral keys
 - Offline message encryption & local storage
 - User authentication and verification(JWT + OTP Based Verification of chat channel)
 - Digital signatures (ECDSA)
 - Mobile-responsive PWA version

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/secretsync.git
cd secretsync

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Start backend server
cd server
npm start

# Start React Frontend
cd ../client
npm start


