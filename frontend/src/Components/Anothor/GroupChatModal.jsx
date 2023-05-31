import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { connect } from "react-redux";
import UserItem from "./UserItem";
import UserBadgeItem from "./UserBadgeItem";

function GroupChatModal(props) {
    const { children, chatReducer, setChats } = props;
    const { user, chats } = chatReducer;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

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
    const handleSubmit = async () => {
        if (groupChatName === "" || selectedUsers.length === 0) {
            toast({
                title: "Cảnh báo",
                description: "Xin vui lòng điền đầy đủ các trường",
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
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `api/v1/chat/creategroup`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            console.log(data);
            const copyChats = JSON.parse(JSON.stringify(chats));
            setChats([...copyChats, data]);
            onClose();
            toast({
                title: "Thành công",
                description: "Tạo group chat thành công",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            setLoading(false);
            toast({
                title: "Lỗi không tạo được nhóm chát",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const handleGroup = (userToAdd) => {
        const copySelectedUsers = JSON.parse(JSON.stringify(selectedUsers));
        const index = copySelectedUsers.findIndex((item) => {
            return item._id === userToAdd._id;
        });
        if (index !== -1) {
            toast({
                title: "Cảnh báo",
                description: "Người dùng đã được thêm",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (index === -1) {
            setSelectedUsers([...selectedUsers, userToAdd]);
        }
    };

    const handleDelete = (delUser) => {
        const copySelectedUsers = JSON.parse(JSON.stringify(selectedUsers));
        const index = copySelectedUsers.findIndex((item) => {
            return item._id === delUser._id;
        });
        copySelectedUsers.splice(index, 1);
        setSelectedUsers(copySelectedUsers);
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: Long, Nhi, Vy"
                                mb={1}
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                }}
                            />
                        </FormControl>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
                            {selectedUsers.map((u) => {
                                return (
                                    <UserBadgeItem
                                        key={u._id}
                                        payload={{ user: u, handleClick: handleDelete }}
                                    />
                                );
                            })}
                        </Box>
                        {loading ? (
                            <div>loading</div>
                        ) : (
                            searchResult?.slice(0, 4).map((u) => {
                                return (
                                    <UserItem
                                        key={u._id}
                                        payload={{ user: u, handleClick: handleGroup }}
                                    />
                                );
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        chatReducer: state.chatReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setChats: (data) => {
            const action = {
                type: "CHATS",
                payload: data,
            };
            dispatch(action);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatModal);
