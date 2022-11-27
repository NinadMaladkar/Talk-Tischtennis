import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button, VStack, useToast } from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const toast = useToast();
  const handleClick = () => setShow(!show);
  const history = useHistory();

  const postDetails = (pics) => {
    setUploadLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'talk-tischtennis');
      data.append('cloud_name', 'dwbaf1kvd');
      fetch('https://api.cloudinary.com/v1_1/dwbaf1kvd/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setUploadLoading(false);
        })
        .catch((error) => {
          console.error(error.message);
          setUploadLoading(false);
        });
    } else {
      toast({
        title: 'Please Select an Image with JPEG or PNG format!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    //https://api.cloudinary.com/v1_1/talk-tischtennis/image/upload
  };

  const submitHandler = async () => {
    setUploadLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      console.log(name, email, password, confirmPassword);
      toast({
        title: 'Please fill all fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setUploadLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Confirm password does not match with password',
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
        name: name,
        email: email,
        password: password,
        pic: pic,
      };
      const response = await axios.post(
        'http://localhost:5000/api/user',
        postData
      );

      toast({
        title: 'Registration successful',
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
        title: 'Error occurred!',
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
    <VStack spacing='5px'>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          borderWidth={1}
          placeholder='Enter your Name'
          _placeholder={{ opacity: 0.4, color: 'inherit' }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          borderWidth={1}
          placeholder='Enter your Email'
          _placeholder={{ opacity: 0.4, color: 'inherit' }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            borderWidth={1}
            placeholder='Enter your Password'
            _placeholder={{ opacity: 0.4, color: 'inherit' }}
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
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Confirm your Password'
            _placeholder={{ opacity: 0.4, color: 'inherit' }}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='small' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
        <Button
          color='black'
          colorScheme='blue'
          width='100%'
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={uploadLoading}>
          Sign Up
        </Button>
      </FormControl>
    </VStack>
  );
};

export default SignUp;
