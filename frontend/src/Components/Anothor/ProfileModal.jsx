import { ViewIcon } from "@chakra-ui/icons";
import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";

function ProfileModal({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />
            )}
            <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h={"410px"}>
                    <ModalHeader>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image
                            borderRadius={"full"}
                            boxSize={"150px"}
                            src={user.pic}
                            alt={user.name}
                            mx={"auto"}
                        />
                        <Text
                            textAlign={"center"}
                            fontSize={{ base: "28px", md: "30px" }}
                            mt={"3rem"}
                        >
                            {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
export default ProfileModal;
