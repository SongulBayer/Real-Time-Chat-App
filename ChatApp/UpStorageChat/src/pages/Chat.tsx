import React, { useState } from 'react';
import { Feed, Segment } from 'semantic-ui-react';

interface Message {
    id: number;
    name: string;
    content: string;
    timestamp: string;
}

interface ChatProps {
    name: string;
}

const Chat: React.FC<ChatProps> = ({ name }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            const newMessage: Message = {
                id: messages.length + 1,
                name,
                content: input,
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages([...messages, newMessage]);
            setInput('');
        }
    };

    return (
        <div className="page">
            <div className="chat-container">
                <div className="sidebar">
                    <h2>Katılanlar</h2>
                    {/* Solda kimlerin join olduğu görünecek */}
                </div>
                <div className="chat">
                    <Segment>
                        <Feed>
                            {messages.map((message) => (
                                <Feed.Event key={message.id}>
                                    <Feed.Content>
                                        <Feed.Summary>
                                            <strong>{message.name}</strong> - {message.timestamp}
                                        </Feed.Summary>
                                        <Feed.Extra text>{message.content}</Feed.Extra>
                                    </Feed.Content>
                                </Feed.Event>
                            ))}
                        </Feed>
                    </Segment>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Mesajınızı yazın..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Gönder</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
