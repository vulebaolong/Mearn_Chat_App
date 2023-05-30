import React, { useEffect, useState } from "react";
import axios from "axios";

function ChatPage() {
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        const { data } = await axios.get("/api/v1/chats");
        console.log(data);
        setChats(data.chats);
    };

    useEffect(() => {
        fetchChats();
    }, []);
    return (
        <div>
            {chats.map((chat) => {
                return <div key={chat._id}>{chat.chatName}</div>;
            })}
        </div>
    );
}

export default ChatPage;
