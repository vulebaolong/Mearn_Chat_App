import {
    Box,
    Container,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useHistory } from "react-router-dom";

function HomePage(props) {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
        console.log(user);
        history.push("/chats");
    }
    return (
        <Container maxW="xl" centerContent={true}>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" textAlign={"center"}>
                    Chat App
                </Text>
            </Box>
            <Box w={"100%"} p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant="soft-rounded" colorScheme="green">
                    <TabList mb={"1rem"}>
                        <Tab w={"50%"}>Login</Tab>
                        <Tab w={"50%"}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {/* Login */}
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            {/* SignUp */}
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}

export default HomePage;
