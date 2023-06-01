const initState = {
    user: JSON.parse(localStorage.getItem("userInfo")),
    selectedChat: {},
    chats: [],
    notification: [],
};

export const chatReducer = (state = initState, { type, payload }) => {
    if (type === "SET_USER") {
        const coppyState = JSON.parse(JSON.stringify(state));
        coppyState.user = payload;
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

    if (type === "NOTIFICATION") {
        const coppyState = JSON.parse(JSON.stringify(state));
        coppyState.notification = payload;
        return coppyState;
    }

    return state;
};
