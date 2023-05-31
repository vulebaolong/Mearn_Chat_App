import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Anothor/SideDrawer";
import MyChats from "../Components/Anothor/MyChats";
import ChatBox from "../Components/Anothor/ChatBox";
import { connect } from "mongoose";

function ChatPage(props) {
    const { user } = props;
    const history = useHistory();
    if (!user) history.push("/");
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                justifyContent={"space-between"}
                display={"flex"}
                w={"100%"}
                h={"91.5vh"}
                p={"10px"}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </Box>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        user: state.chatReducer.user,
    };
};

export default connect(mapStateToProps)(ChatPage);
