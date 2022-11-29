import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';
import ChatBox from './ChatBox';
import MyChats from './MyChats';
import Sidebar from './Sidebar';

const ChatsPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: '100%' }}>
      {user && <Sidebar />}

      <Box d='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
        {user && <MyChats />}

        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatsPage;
