import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface Message {
    userName: string;
    content: string;
    createdOn: Date;
}

const ChatScreen = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7054/Hubs/ChatHub')
            .withAutomaticReconnect()
            .build();

        newConnection.start().then(() => {
            console.log('Connected to the hub');
        });
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.on('MessageAdded', (message: Message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            connection.on('NewUserJoined', (userName: string) => {
                setUsers((prevUsers) => [...prevUsers, userName]);
            });

            connection.on('UserRemoved', (userName: string) => {
                setUsers((prevUsers) => prevUsers.filter((user) => user !== userName));
            });
        }
    }, [connection]);

    const joinChatRoom = async () => {
        if (connection) {
            await connection.invoke('JoinChatRoom', username);
            setUsers([...users, username]);
        }
    };

    const leaveChatRoom = async () => {
        if (connection && username !== '') {
            await connection.invoke('LeaveRoom', username);
            setUsers((prevUsers) => prevUsers.filter((user) => user !== username));
            setUsername('');
        }
    };

    const sendMessage = async () => {
        if (connection && inputMessage !== '') {
            await connection.invoke('SendMessage', username, inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ marginRight: '10px' }}>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '5px' }} />
                <button onClick={joinChatRoom} style={{ padding: '5px', marginLeft: '10px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>Join Chat Room</button>
                <button onClick={leaveChatRoom} style={{ padding: '5px', marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>Leave Chat Room</button>
            </div>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Users</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '5px', backgroundColor: '#f2f2f2' }}>Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td style={{ padding: '5px', borderBottom: '1px solid #ccc' }}>{user}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ flex: 2 }}>
                    <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Chat</h3>
                    <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                        {messages.map((message, index) => (
                            <div key={index} style={{ marginBottom: '5px' }}>
                                <strong>{message.userName}: </strong>
                                {message.content}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} style={{ padding: '5px' }} />
                        <button onClick={sendMessage} style={{ padding: '5px', marginLeft: '10px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}>Send Message</button>
                    </div>
                </div>
            </div>
        </div>
    );
    //dsfs
};

export default ChatScreen;