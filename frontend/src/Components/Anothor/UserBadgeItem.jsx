import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

function UserBadgeItem(props) {
    const { user, handleClick } = props.payload;
    return (
        <Box
            px={"2"}
            py={"2"}
            borderRadius={"lg"}
            m={1}
            mb={2}
            variant={"solid"}
            fontSize={12}
            bg={"#38B2AC"}
            cursor={"pointer"}
            onClick={() => {
                handleClick(user);
            }}
        >
            {user.name}
            <CloseIcon pl={1} />
        </Box>
    );
}
export default UserBadgeItem;
