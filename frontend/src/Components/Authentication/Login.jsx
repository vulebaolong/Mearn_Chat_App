import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleClickShow = () => {
        setShow(!show);
    };

    const postDetail = (params) => {};

    const handleSubmit = (params) => {};
    return (
        <VStack spacing={"5px"}>
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

            <Button
                w={"100%"}
                style={{ marginTop: "2rem" }}
                colorScheme="green"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Login
            </Button>
            <Button
                w={"100%"}
                style={{ marginTop: "2rem" }}
                colorScheme="red"
                onClick={() => {
                    handleSubmit();
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
}

export default Login;
