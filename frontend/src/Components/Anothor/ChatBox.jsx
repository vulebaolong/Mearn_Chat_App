import { Box } from "@chakra-ui/react";
import { connect } from "react-redux";
import SingleChat from "./SingleChat";

function ChatBox(props) {
    const { selectedChat, fetchAgain, setFetchAgain } = props;
    return (
        <Box
            display={{ base: selectedChat._id ? "flex" : "none", md: "flex" }}
            alignItems={"center"}
            flexDir={"column"}
            p={3}
            w={{ base: "100%", md: "68%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
}

const mapStateToProps = (state) => {
    return {
        selectedChat: state.chatReducer.selectedChat,
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setSelectedChat: (data) => {
//             const action = {
//                 type: "XXXXX",
//                 payload: data,
//             };
//             dispatch(action);
//         }
//     };
// };

export default connect(mapStateToProps)(ChatBox);
