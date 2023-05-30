import { Avatar, Box, Text } from "@chakra-ui/react";
import { color } from "framer-motion";

function UserItem(props) {
    const { user, accessChat } = props.payload;
    return (
        <Box
            onClick={() => {
                accessChat(user._id);
            }}
            cursor={"pointer"}
            _hover={{
                background: "#38B2AC",
            }}
            w={"100%"}
            display={"flex"}
            alignItems={"center"}
            px={3}
            mb={2}
            borderRadius={"lg"}
        >
            <Avatar
                mr={2}
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize={"xs"}>
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    );
}
export default UserItem;
