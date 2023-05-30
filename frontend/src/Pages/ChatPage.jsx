import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Anothor/SideDrawer";
import MyChats from "../Components/Anothor/MyChats";
import ChatBox from "../Components/Anothor/ChatBox";

function ChatPage(props) {
    const [chats, setChats] = useState([]);

    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user) {
        console.log(user);
        history.push("/");
    }

    const fetchChats = async () => {
        // const { data } = await axios.get("/api/v1/chats");
        // console.log(data);
        // setChats(data.chats);
    };

    useEffect(() => {
        fetchChats();
    }, []);
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                justifyContent={"space-between"}
                display={"flex"}
                w={"100%"}
                h={"91.5vh"}
                p={"10px"}
            >
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    );
}

export default ChatPage;
