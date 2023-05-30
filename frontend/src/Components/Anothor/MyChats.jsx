import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../util/chatLogic";

function MyChats(props) {
    const { chatReducer, setChats, setSelectedChat } = props;
    const { user, selectedChat, chats } = chatReducer;
    const [loggedUser, setLoggedUser] = useState();
    const toast = useToast();

    const fetchChat = async () => {
        try {
            // setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get("/api/v1/chat/", config);
            console.log(data);
            setChats(data);
        } catch (error) {
            toast({
                title: "Lỗi tìm nạp cuộc trò chuyện",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChat();
    }, []);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            p={3}
            w={{ base: "100%", md: "31%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                My Chat
                <Button
                    display={"flex"}
                    fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                    rightIcon={<AddIcon />}
                >
                    New Group Chat
                </Button>
            </Box>
            <Box
                display={"flex"}
                flexDir={"column"}
                p={3}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => {
                            return (
                                <Box
                                    onClick={() => {
                                        setSelectedChat(chat);
                                    }}
                                    cursor={"pointer"}
                                    bg={
                                        selectedChat._id === chat._id
                                            ? "#38B2AC"
                                            : "#E8E8E8"
                                    }
                                    color={
                                        selectedChat._id === chat._id ? "white" : "black"
                                    }
                                    px={3}
                                    py={2}
                                    borderRadius={"lg"}
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </Text>
                                </Box>
                            );
                        })}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
}

const mapStateToProps = (state) => {
    return {
        chatReducer: state.chatReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedChat: (data) => {
            const action = {
                type: "SELECTED_CHAT",
                payload: data,
            };
            dispatch(action);
        },
        setChats: (data) => {
            const action = {
                type: "CHATS",
                payload: data,
            };
            dispatch(action);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyChats);
