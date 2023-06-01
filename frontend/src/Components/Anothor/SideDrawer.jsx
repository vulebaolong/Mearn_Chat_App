import {
    Avatar,
    Badge,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { getSender } from "../../util/chatLogic";

function SideDrawer(props) {
    const { setSelectedChat, chats, setChats, setUser, notification, setNotification } =
        props;
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setUser("");
        setSelectedChat({});
        setChats([]);
        history.push("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Cảnh báo",
                description: "Xin vui lòng nhập nội dung tìm kiếm",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/v1/user/?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể tải kết quả tìm kiếm",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const accessChat = async (userFet) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                "/api/v1/chat/",
                { userId: userFet._id },
                config
            );
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
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
    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                w={"100%"}
                p={"5px 10px 5px 10px"}
                borderWidth={"5px"}
                borderRadius={"1rem"}
            >
                <Tooltip
                    label="Tìm kiếm người dùng để chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant={"ghost"} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    Chat App
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <Badge colorScheme="red">{notification.length}</Badge>
                            <BellIcon fontSize={"2xl"} m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {notification.length === 0 && "Không có tin nhắn mới"}
                            {notification.map((noti) => {
                                return (
                                    <MenuItem
                                        key={noti._id}
                                        onClick={() => {
                                            setSelectedChat(noti.chat);
                                            setNotification(
                                                notification.filter((n) => n !== noti)
                                            );
                                        }}
                                    >
                                        {noti.chat.isGroupChat
                                            ? `Tin nhắn mới ${noti.chat.chatName}`
                                            : `Tin nhắn mới của: ${getSender(
                                                  user,
                                                  noti.chat.users
                                              )}`}
                                    </MenuItem>
                                );
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size={"sm"}
                                cursor={"pointer"}
                                name={user.name}
                                src={user.pic}
                            ></Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>

                            <MenuDivider />
                            <MenuItem
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                            <Button
                                onClick={() => {
                                    handleSearch();
                                }}
                            >
                                Go{" "}
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => {
                                return (
                                    <UserItem
                                        key={user._id}
                                        payload={{ user, handleClick: accessChat }}
                                    />
                                );
                            })
                        )}
                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

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
        setUser: (data) => {
            const action = {
                type: "SET_USER",
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

const mapStateToProps = (state) => {
    return {
        chats: state.chatReducer.chats,
        notification: state.chatReducer.notification,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
