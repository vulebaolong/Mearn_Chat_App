import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Toast,
    VStack,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClickShow = () => {
        setShow(!show);
    };

    const postDetail = () => {};

    const handleSubmit = async () => {
        setLoading(true);
        if (!email || !password) {
            Toast({
                title: "Xin vui lòng nhập các thông tin",
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
                "/api/v1/user/login",
                { email, password },
                config
            );
            toast({
                title: "Đăng nhập thành công",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
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
                <FormLabel>Email</FormLabel>
                <Input
                    value={email}
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
                        value={password}
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

            <Button
                w={"100%"}
                style={{ marginTop: "2rem" }}
                colorScheme="green"
                onClick={() => {
                    handleSubmit();
                }}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                w={"100%"}
                style={{ marginTop: "2rem" }}
                colorScheme="red"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
}

export default Login;
