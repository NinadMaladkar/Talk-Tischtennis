import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';
import io from 'socket.io-client';
import Lottie from 'react-lottie';

import { ChatState } from '../../Context/ChatProvider';
import { getSenderName, getSenderDetails } from '../../config/ChatLogic';
import ProfileModal from '../Profile/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import '../../App.css';
import animationData from '../../animations/typing_loading.json';
import loadingAnimation from '../../animations/loading.json';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchChats, setFetchChats }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        // setting newMessage to empty so that after enter it will instantly clear the input field but won't affect the API call
        setNewMessage('');
        const response = await axios.post(
          `http://localhost:5000/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit('new message', response.data);
        setMessages([...messages, response.data]);
      } catch (error) {
        toast({
          title: 'An error occurred!',
          description: 'Failed to send the message',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-left',
        });
        return;
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDifference = timeNow - lastTypingTime;
      if (timeDifference >= 3000 && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  const fetchMesssages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      // setting newMessage to empty so that after enter it will instantly clear the input field but won't affect the API call
      setNewMessage('');
      const response = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,

        config
      );
      setMessages(response.data);

      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'An error occurred!',
        description: 'Failed to load the messages',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
    socket.on('typing', () => {
      setIsTyping(true);
    });
    socket.on('stop typing', () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMesssages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchChats(!fetchChats);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  }, [messages]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchChats={fetchChats}
                  setFetchChats={setFetchChats}
                  fetchMesssages={fetchMesssages}
                />
              </>
            )}
          </Text>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'>
            {loading ? (
              // <Spinner
              //   sieze='xl'
              //   w={20}
              //   h={20}
              //   alignSelf='center'
              //   margin='auto'
              // />
              <Lottie
                width='50px'
                options={loadingOptions}
                style={{ marginBottom: 5, marginLeft: 0 }}
              />
            ) : (
              <div>
                <ScrollableChat messages={messages} />
              </div>
            )}

            {isTyping && (
              <div>
                <Lottie
                  width='50px'
                  options={defaultOptions}
                  style={{ marginBottom: 5, marginLeft: 0 }}
                />
              </div>
            )}
            <FormControl onKeyUp={sendMessage} isRequired mt={3} display='flex'>
              <Input
                variant='filled'
                bg='#E0E0E0'
                color='black'
                value={newMessage}
                placeholder='Type your message...'
                _placeholder={{ opacity: 0.4, color: 'inherit' }}
                onChange={typingHandler}
              />
              <Button backgroundColor='green.100' onClick={sendMessage}>
                {/* <i class='fa-regular fa-paper-plane-÷top'></i> */}
                {/* <i class='fa-solid fa-paper-plane-top'></i> */}
                {/* <i className='fas fa-paper-plane-top' color='black'></i> */}
                <i className='fa-regular fa-paper-plane-top'>Send</i>
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          h='100%'>
          <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
