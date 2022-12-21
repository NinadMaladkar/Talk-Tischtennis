import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';

import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../Users/UserListItem';
import UserBadgeItem from '../Users/UserBadgeItem';
import { SERVER_URI } from '../../config/config';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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
        `${SERVER_URI}api/user?search=${search}`,
        config
      );
      console.log(response.data);
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
  const handleSubmit = async (e) => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setSelectedUsers([...selectedUsers, user._id]);
      // console.log(selectedUsers, ' < all users in the group', user);

      const response = await axios.post(
        `${SERVER_URI}api/chat/create-group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([response.data, ...chats]);
      onClose();
      toast({
        title: 'New group chat created ',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    } catch (error) {
      toast({
        title: 'Failed to create the chat',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };
  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const addUserToGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User is already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  return (
    <>
      <span onClick={onOpen}> {children} </span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' alignItems='center'>
            <FormControl>
              <Input
                placeholder='Group Chat Name'
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Input
                placeholder='Search users '
                mb={3}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            <Box display='flex' flexWrap='wrap' w='100%'>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => addUserToGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
