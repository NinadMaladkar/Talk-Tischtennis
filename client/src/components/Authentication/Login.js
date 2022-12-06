import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button, VStack, useToast } from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setUploadLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setUploadLoading(false);
      return;
    }

    try {
      const postData = {
        email: email,
        password: password,
      };
      const response = await axios.post(
        'http://localhost:5000/api/user/login',
        postData
      );

      toast({
        title: 'Logged in successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUploadLoading(false);
      history.push('/chats');
    } catch (error) {
      console.log(error);
      toast({
        title: 'An Error occurred!',
        description: error.response.data.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setUploadLoading(false);
    }
  };
  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          borderWidth={1}
          placeholder='Enter your Email'
          onChange={(e) => {
            setEmail(e.target.value);
          }}></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            borderWidth={1}
            placeholder='Enter your Password'
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='small' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        color='black'
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={uploadLoading}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
