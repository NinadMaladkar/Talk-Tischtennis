import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  Flex,
  Avatar,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';

import ChatLoading from './ChatLoading';
import ProfileModal from '../Profile/ProfileModal';
import {
  ChatState,
  setSelectedChat,
  chats,
  setChats,
} from '../../Context/ChatProvider';
import UserListItem from '../Users/UserListItem';

const Sidebar = () => {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const logouHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const { user, chats, setSelectedChat, setChats } = ChatState();

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId: userId },
        config
      );

      if (!chats.find((c) => c._id === response.data._id)) {
        setChats([response.data, ...chats]);
      }

      setSelectedChat(response.data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in the search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
    } catch (error) {
      toast({
        title: 'An unexpected error occurred while searching for users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(response.data);
    } catch (error) {
      toast({
        title: 'An error occurred! Unable to search for users ',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };

  return (
    <>
      <Flex
        justifyContent='space-between'
        alignItems='center'
        bg='gray.300'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'>
        <Tooltip
          color='black'
          label='Search users to chat with'
          hasArrow
          placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i className='fas fa-search' color='black'></i>
            <Text
              d={{ base: 'none', md: 'flex' }}
              color='black'
              fontSize='lg'
              px='4'>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize='4xl' fontFamily='Work sans'>
          Talk Tischtennis
        </Text>
        <div>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<BellIcon fontSize='3xl' m={1} />}></MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon fontSize='3xl' m={1} />}>
              <Avatar
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.pic}></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logouHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>

      <Drawer onClose={onClose} isOpen={isOpen} placement='left'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search for a user'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
