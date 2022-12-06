import React from 'react';
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Image,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}> {children} </span>
      ) : (
        <IconButton
          display={{ base: 'flex' }}
          icon={<ViewIcon />}
          onClick={onOpen}></IconButton>
      )}

      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='4xl'
            display='flex'
            fontFamily='Work sans'
            justifyContent='center'>
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'>
            <Image
              borderRadius='full'
              boxSize='200px'
              src={user.pic}
              alt={user.name}></Image>
            <Text
              my='10px'
              fontSize={{ base: '28px', md: '30px' }}
              fontFamily='Work sans'>
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter display='flex' justifyContent='center'>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
