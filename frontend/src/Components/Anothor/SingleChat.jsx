import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    useToast,
} from "@chakra-ui/react";
import { connect } from "react-redux";
import { getSender, getSenderFull } from "../../util/chatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../../asset/typing.json";

const ENDPOINT = "http://localhost:3001";
let socket, selectedChatCompare;

function SingleChat(props) {
    const {
        fetchAgain,
        setFetchAgain,
        user,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
    } = props;
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();

    const [socketConnected, setSocketConnected] = useState(false);

    const fetchMessage = async () => {
        if (!selectedChat._id) return;
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(
                `api/v1/message/${selectedChat._id}`,
                config
            );
            setMessage(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
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

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage !== "") {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");

                const { data } = await axios.post(
                    "/api/v1/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessage([...message, data]);
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
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        const lastTypingTime = new Date().getTime();
        const timeLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timeLength && typing) {
                // if (timeDiff >= timeLength) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timeLength);
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => {
            setIsTyping(false);
        });
    }, []);

    useEffect(() => {
        fetchMessage();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    console.log(notification, "-------------");

    useEffect(() => {
        socket.on("message recived", (newMessageRecived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecived.chat._id
            ) {
                if (!notification.includes(newMessageRecived)) {
                    setNotification([newMessageRecived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessage([...message, newMessageRecived]);
            }
        });
    });

    return (
        <>
            {selectedChat._id ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w={"100%"}
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat({})}
                        />
                        {selectedChat.isGroupChat ? (
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessage={fetchMessage}
                                />
                            </>
                        ) : (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        borderWidth={"1px"}
                        overflowY={"hidden"}
                    >
                        {loading ? (
                            <Spinner
                                size={"xl"}
                                w={20}
                                h={20}
                                alignSelf={"center"}
                                margin={"auto"}
                            />
                        ) : (
                            <div className="message">
                                <ScrollableChat message={message} />
                            </div>
                        )}
                        <FormControl
                            onKeyDown={(e) => {
                                sendMessage(e);
                            }}
                            isRequired
                            mt={3}
                        >
                            {isTyping ? (
                                <div>
                                    <Lottie
                                        animationData={animationData}
                                        loop={true}
                                        style={{
                                            marginBottom: 15,
                                            marginLeft: 0,
                                            width: "70px",
                                        }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant={"filled"}
                                placeholder="Enter a message"
                                onChange={(e) => {
                                    typingHandler(e);
                                }}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={"100%"}
                >
                    <Text fontSize={"3xl"} pb={3}>
                        Vui lòng click danh sách để chat
                    </Text>
                </Box>
            )}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.chatReducer.user,
        selectedChat: state.chatReducer.selectedChat,
        notification: state.chatReducer.notification,
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
        setNotification: (data) => {
            const action = {
                type: "NOTIFICATION",
                payload: data,
            };
            dispatch(action);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleChat);
