import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button, VStack } from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import React from 'react';
import { useState } from 'react';

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');

  const handleClick = () => setShow(!show);

  const postDetails = () => {};
  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          borderWidth={1}
          placeholder='Enter your Name'
          onChange={(e) => {
            setName(e.target.value);
          }}></Input>
      </FormControl>
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
            }}></Input>
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='small' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <InputGroup>
          <Input
            focusBorderColor='pink.400'
            type={show ? 'text' : 'password'}
            borderWidth={1}
            placeholder='Confirm your Password'
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}></Input>
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='small' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
    </VStack>
  );
};

export default SignUp;
