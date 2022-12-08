import { ViewIcon } from '@chakra-ui/icons';
import {
  useDisclosure,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  IconButton,
  useToast,
  Divider,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';

import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../Users/UserBadgeItem';
import UserListItem from '../Users/UserListItem';

const UpdateGroupChatModal = ({
  fetchChats,
  setFetchChats,
  fetchMesssages,
}) => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.put(
        `http://localhost:5000/api/chat/rename-group`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(response.data);
      setRenameLoading(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setRenameLoading(false);
      return;
    }
    setGroupChatName('');
    onClose();
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
        title: 'An error occurred!',
        description: 'Failed to load search results',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User already in the group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins are allowed to add new users!',
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
      const response = await axios.put(
        `http://localhost:5000/api/chat/add-to-group`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(response.data);
      setFetchChats(!fetchChats);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'An error occurred!',
        description: 'Failed to add user',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'Only admins can remove users!',
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
      const response = await axios.put(
        `http://localhost:5000/api/chat/remove-from-group`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id
        ? setSelectedChat()
        : setSelectedChat(response.data);
      setFetchChats(!fetchChats);
      fetchMesssages();
      setLoading(false);
    } catch (error) {
      toast({
        title: 'An error occurred!',
        description: 'Faild to remove user',
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
      <Box aria-label='Focus moved to this box'>
        Some other content that'll receive focus on close.
      </Box>

      <IconButton
        mt={4}
        onClick={onOpen}
        display='flex'
        icon={<ViewIcon />}
        justifyContent=''
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Box
              display='flex'
              w='100%'
              justifyContent='center'
              flexWrap='wrap'
              pb={3}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    handleRemove(user);
                  }}
                />
              ))}
            </Box>
            <FormControl display='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant='solid'
                backgroundColor='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}>
                Update
              </Button>
            </FormControl>
            <FormControl display='flex'>
              <Input
                placeholder='Add users to group'
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    handleAddUser(user);
                  }}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter display='flex' justifyContent='center'>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Exit Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
