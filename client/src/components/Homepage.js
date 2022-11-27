import React from 'react';
import Login from './Authentication/Login';
import SignUp from './Authentication/Signup';
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';

const Homepage = () => {
  return (
    <Container maxW='xl' centerContent>
      <Box
        display='flex'
        justifyContent='center'
        p={3}
        m='40px 0 15px 0'
        w='100%'
        bg='white'
        borderRadius='lg'
        borderWidth={1}>
        <Text fontSize='4xl' fontFamily='Work sans' color='black'>
          Talk TischTennis
        </Text>
      </Box>
      <Box
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        color='black'
        borderWidth='1px'>
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
          <TabList mb='1em'>
            <Tab width='50%'>Log In</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
