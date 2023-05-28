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

function SignUp() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();

    const handleClickShow = () => {
        setShow(!show);
    };

    const postDetail = (params) => {};

    const handleSubmit = (params) => {};
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
            >
                Signup
            </Button>
        </VStack>
    );
}

export default SignUp;
