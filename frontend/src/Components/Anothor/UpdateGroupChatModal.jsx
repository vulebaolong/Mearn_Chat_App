import { ViewIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { connect } from "react-redux";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserItem from "./UserItem";

function UpdateGroupChatModal(props) {
    const {
        fetchAgain,
        setFetchAgain,
        selectedChat,
        user,
        setSelectedChat,
        fetchMessage,
    } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = async (userDel) => {
        // if (selectedChat.groupAdmin._id !== user._id && userDel._id !== user._id) {
        //     toast({
        //         title: "Cảnh báo",
        //         description: "Phải là admin",
        //         status: "warning",
        //         duration: 5000,
        //         isClosable: true,
        //         position: "bottom",
        //     });
        //     return;
        // }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/v1/chat/deleteusergroup",
                {
                    chatId: selectedChat._id,
                    userId: userDel._id,
                },
                config
            );
            userDel._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessage();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    const handleRname = async () => {
        if (groupChatName.length === 0) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/v1/chat/renamegroup",
                {
                    chatName: groupChatName,
                    chatId: selectedChat._id,
                },
                config
            );
            console.log(data);
            setSelectedChat(data);
            setRenameLoading(false);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }

        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`api/v1/user/?search=${search}`, config);

            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false);
            toast({
                title: "Lỗi tìm nạp được từ khóa tìm kiếm",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const handleAddUser = async (userToAdd) => {
        // const copyselectedChat = JSON.parse(JSON.stringify(selectedChat));
        const indexUser = selectedChat.users.findIndex((u) => u._id === userToAdd._id);
        if (indexUser !== -1) {
            toast({
                title: "Cảnh báo",
                description: "Người dùng đã có trong group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        // if (selectedChat.groupAdmin._id !== user._id) {
        //     toast({
        //         title: "Cảnh báo",
        //         description: "Phải là admin",
        //         status: "warning",
        //         duration: 5000,
        //         isClosable: true,
        //         position: "bottom",
        //     });
        //     return;
        // }
        console.log(userToAdd);
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/v1/chat/addgroup",
                {
                    chatId: selectedChat._id,
                    userId: userToAdd._id,
                },
                config
            );
            console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                            {selectedChat.users.map((u) => {
                                return (
                                    <UserBadgeItem
                                        key={u._id}
                                        payload={{ user: u, handleClick: handleRemove }}
                                    />
                                );
                            })}
                        </Box>
                        <FormControl display={"flex"}>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value);
                                }}
                            />
                            <Button
                                variant={"solid"}
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={() => {
                                    handleRname();
                                }}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                }}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size={"lg"} />
                        ) : (
                            searchResult.map((u) => {
                                return (
                                    <UserItem
                                        key={u._id}
                                        payload={{ user: u, handleClick: handleAddUser }}
                                    />
                                );
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                // handleRemove(user);
                            }}
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
const mapStateToProps = (state) => {
    return {
        selectedChat: state.chatReducer.selectedChat,
        user: state.chatReducer.user,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateGroupChatModal);
