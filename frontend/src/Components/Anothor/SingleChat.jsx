import { connect } from "react-redux";

function SingleChat(props) {
    const { fetchAgain, setFetchAgain, user, selectedChat, setSelectedChat } = props;

    return <div>SingleChat</div>;
}
const mapStateToProps = (state) => {
    return {
        user: state.chatReducer.user,
        selectedChat: state.chatReducer.selectedChat,
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

export default connect(mapStateToProps, mapDispatchToProps)(SingleChat);
