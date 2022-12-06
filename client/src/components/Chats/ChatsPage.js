import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';
import ChatBox from './ChatBox';
import MyChats from './MyChats';
import Sidebar from './Sidebar';

const ChatsPage = () => {
  const { user } = ChatState();
  const [fetchChats, setFetchChats] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      {user && <Sidebar />}

      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'>
        {user && <MyChats fetchChats={fetchChats} />}

        {user && (
          <ChatBox fetchChats={fetchChats} setFetchChats={setFetchChats} />
        )}
      </Box>
    </div>
  );
};

export default ChatsPage;
