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
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';

const Sidebar = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();

  const { user } = ChatState();

  return (
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
        <Button variant='ghost'>
          <i class='fas fa-search' color='black'></i>
          <Text
            d={{ base: 'none', md: 'flex' }}
            color='black'
            fonrSize='2xl'
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
            rightIcon={<ChevronDownIcon fontSize='3xl' m={1} />}></MenuButton>
          <Avatar
            size='sm'
            cursor='pointer'
            name={user.name}
            src={user.pic}></Avatar>
          <MenuList>
            <MenuItem>My Profile</MenuItem>
            <MenuDivider />
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Flex>
  );
};

export default Sidebar;
