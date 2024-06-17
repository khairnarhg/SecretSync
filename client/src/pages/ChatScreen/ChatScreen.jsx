import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import './ChatScreen.css';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [encryptionKey, setEncryptionKey] = useState(null);
    const [encryptedMode, setEncryptedMode] = useState(true); 

    const socket = io("http://localhost:5000");

    useEffect(() => {
        const fetchData = async () => {
            socket.on("connect", () => {
                console.log('connected');
            });

            socket.on("message", async (message) => {
                
                if (!encryptedMode) {
                    const decryptedMessage = await decryptMessage(message);
                    setMessages(prevMessages => [...prevMessages, decryptedMessage]);
                } else {
                    setMessages(prevMessages => [...prevMessages, message]);
                }
            });

            socket.on("encryption_keys", ({ encryptionKey }) => {
                console.log('Received encryption key');
                console.log(encryptionKey);
                importEncryptionKey(encryptionKey).then(importedKey => {
                    setEncryptionKey(importedKey);
                });
            });
        };

        fetchData();

        return () => {
            socket.disconnect();
        };
    }, [encryptedMode]);

    const sendMessage = async () => {
        if (inputMessage.trim() !== '') {
            const message = encryptedMode ? await encryptMessage(inputMessage) : inputMessage;
            socket.emit("message", message);
            setInputMessage('');
        }
    };

    const importEncryptionKey = async (keyBuffer) => {
        try {
            const importedKey = await window.crypto.subtle.importKey(
                'raw', 
                keyBuffer, 
                { name: 'AES-GCM' }, 
                true, // extractable
                ['encrypt', 'decrypt'] 
            );
            return importedKey;
        } catch (error) {
            console.error('Error importing encryption key:', error);
            throw error;
        }
    };

    const encryptMessage = async (plaintext) => {
        if (!encryptionKey) {
            console.error('Encryption key not available');
            return plaintext;
        }
        
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedPlaintext = new TextEncoder().encode(plaintext);
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            encryptionKey,
            encodedPlaintext
        );
        const encryptedMessage = {
            ciphertext: new Uint8Array(encryptedData),
            iv: iv
        };
        return encryptedMessage;
    };
    
    const decryptMessage = async (message) => {
        if (!encryptionKey) {
            console.error('Encryption key not available');
            return message;
        }

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: message.iv },
            encryptionKey,
            message.ciphertext
        );
        const decryptedPlaintext = new TextDecoder().decode(decryptedData);
        return decryptedPlaintext;
    };

    const toggleEncryptionMode = () => {
        
        setEncryptedMode(!encryptedMode);
    };

    const decodeMessages = async () => {
        const decodedMessages = await Promise.all(messages.map(async (message) => {
            if (typeof message === 'object') {
                return await decryptMessage(message);
            } else {
                return message;
            }
        }));
        setMessages(decodedMessages);
    };

    const encodeMessages = async () => {
        const encodedMessages = await Promise.all(messages.map(async (message) => {
            if (typeof message === 'string') {
                return await encryptMessage(message);
            } else {
                return message;
            }
        }));
        setMessages(encodedMessages);
    };

    return (
        <div className='Container'>
            <div className='logo'>
                SecretSync
            </div>
            <div className='chat-box-container'>
                <div className='chat-box'>
                    
                    <div className='chatting-area'>
                        {messages.map((message, index) => (
                            <div key={index} className='message'>
                                {typeof message === 'object' ? new TextDecoder().decode(message.ciphertext) : message}
                            </div>
                        ))}
                    </div>
                    
                    <div className='user-input-area'>
                        <input
                            type="text"
                            className="text-message"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)} />
                        <button className='button' onClick={sendMessage}>SEND</button>
                    </div>
                    
                    <div className='encryption-buttons'>
                        {/* <button className='button' onClick={toggleEncryptionMode}>
                            {encryptedMode ? 'Decrypt Messages' : 'Encrypt Messages'}
                        </button> */}
                        <button className='button' onClick={decodeMessages}>Decode Messages</button>
                        <button className='button' onClick={encodeMessages}>Encode Messages</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;




