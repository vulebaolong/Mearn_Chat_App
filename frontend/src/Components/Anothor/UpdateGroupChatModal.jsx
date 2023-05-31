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
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { connect } from "react-redux";
import UserBadgeItem from "./UserBadgeItem";

function UpdateGroupChatModal(props) {
    const { fetchAgain, setFetchAgain, selectedChat, user, setSelectedChat } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = () => {
        onClose();
    };
    const handleRname = () => {};
    const handleSearch = () => {};

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
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                handleRemove(user);
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
