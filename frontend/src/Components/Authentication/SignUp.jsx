import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

function SignUp(props) {
    const { setUsers } = props;

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState("");
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleClickShow = () => {
        setShow(!show);
    };

    const postDetail = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Xin vui lòng chọn Hình ảnh",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "Mearn-chat-app");
            data.append("cloud_name", "vulebaolong");
            fetch("https://api.cloudinary.com/v1_1/vulebaolong/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    const url = data.url;
                    setPic(url);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Xin vui lòng chọn Hình ảnh",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Xin vui lòng nhập các thông tin",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: "Mật khẩu nhập lại không khớp",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "api/v1/user/register",
                { name, email, password, pic },
                config
            );
            toast({
                title: "Đăng ký thành công",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUsers(data);
            setLoading(false);
            history.push("/chats");
        } catch (error) {
            console.log("👙  error: ", error);
            toast({
                title: "Có lỗi",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    return (
        <VStack spacing={"5px"}>
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement w={"4.5rem"}>
                        <Button
                            h={"1.75rem"}
                            size={"sm"}
                            onClick={() => {
                                handleClickShow();
                            }}
                        >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement w={"4.5rem"}>
                        <Button
                            h={"1.75rem"}
                            size={"sm"}
                            onClick={() => {
                                handleClickShow();
                            }}
                        >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Up load your avatar</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    placeholder="Enter your avatar"
                    onChange={(e) => postDetail(e.target.files[0])}
                />
            </FormControl>
            <Button
                w={"100%"}
                style={{ marginTop: "2rem" }}
                colorScheme="green"
                onClick={() => {
                    handleSubmit();
                }}
                isLoading={loading}
            >
                Signup
            </Button>
        </VStack>
    );
}
const mapDispatchToProps = (dispatch) => {
    return {
        setUsers: (data) => {
            const action = {
                type: "SET_USER",
                payload: data,
            };
            dispatch(action);
        },
    };
};

export default connect(null, mapDispatchToProps)(SignUp);
