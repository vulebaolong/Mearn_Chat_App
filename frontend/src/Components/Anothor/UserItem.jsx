import { Avatar, Box, Text } from "@chakra-ui/react";
import { color } from "framer-motion";

function UserItem(props) {
    const { user, handleClick } = props.payload;
    return (
        <Box
            onClick={() => {
                handleClick(user);
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
