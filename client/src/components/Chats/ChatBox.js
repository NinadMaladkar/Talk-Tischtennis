import React from 'react';
import { Box } from '@chakra-ui/react';

import { ChatState } from '../../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchChats, setFetchChats }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      flexDirection='column'
      alignItems='center'
      p={3}
      mr={1}
      ml={3}
      bg='white'
      w={{ base: '100%', md: '65%' }}
      borderRadius='lg'
      borderWidth='1px'>
      <SingleChat fetchChats={fetchChats} setFetchChats={setFetchChats} />
    </Box>
  );
};

export default ChatBox;
