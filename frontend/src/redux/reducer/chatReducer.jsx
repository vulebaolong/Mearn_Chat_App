import { GET_USER } from "../constant/chatContant";

const initState = {
    user: JSON.parse(localStorage.getItem("userInfo")),
    selectedChat: "",
    chats: [],
};

export const chatReducer = (state = initState, { type, payload }) => {
    if (type === GET_USER) {
        const coppyState = JSON.parse(JSON.stringify(state));
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        coppyState.user = userInfo;
        return coppyState;
    }

    if (type === "SELECTED_CHAT") {
        const coppyState = JSON.parse(JSON.stringify(state));
        coppyState.selectedChat = payload;
        return coppyState;
    }

    if (type === "CHATS") {
        const coppyState = JSON.parse(JSON.stringify(state));
        coppyState.chats = payload;
        return coppyState;
    }

    return state;
};
