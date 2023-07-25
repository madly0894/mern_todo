import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Confirm } from 'notiflix';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
   Menu,
   MenuButton,
   MenuList,
   MenuGroup,
   MenuDivider,
   Button,
   Avatar,
   Heading,
   Box,
   Text,
   Flex,
   Spinner,
} from '@chakra-ui/react';
import { useSignOut } from '../hooks/useSignOut';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';
import { getEmployeePicture, uploadEmployeePicture } from '../api/employees.api';
import { uploadUserPicture } from '../api/user.api';

const UserMenu = () => {
   const queryClient = useQueryClient();
   const location = useLocation();
   const user = queryClient.getQueryData([QUERY_KEYS.USER]);

   const signOutMutation = useSignOut();
   const deleteUserMutation = useDeleteUser();

   const signOut = () => {
      Confirm.show('Sign out', 'Are you sure you want to sign out?', 'Yes', 'No', () => {
         signOutMutation();
      });
   };

   const deleteUser = () => {
      Confirm.show('Delete user', `Are you sure to delete ${user.username}?`, 'Yes', 'No', () => {
         deleteUserMutation();
      });
   };
   console.log('user', user);

   const {
      mutate: mutateUploadUserPicture,
      isLoading: isLoadingUploadPicture,
      isSuccess: isSuccessUploadPicture,
   } = useMutation({
      mutationFn: uploadUserPicture,
      onSuccess: (data, variables) => {
         // Invalidate and refetch
         queryClient.setQueryData([QUERY_KEYS.USER], { picturePath: URL.createObjectURL(variables) });
      },
      onSettled: (data, variables) => {
         URL.revokeObjectURL(variables);
      },
   });

   const { getRootProps, getInputProps, open } = useDropzone({
      accept: {
         'image/*': [],
      },
      onDrop: acceptedFiles => acceptedFiles.length > 0 && mutateUploadUserPicture(acceptedFiles[0]),
      disabled: isLoadingUploadPicture,
      multiple: false,
      noClick: true,
   });

   console.log('data');

   return (
      <Menu>
         <MenuButton as={Button} colorScheme='black'>
            <Avatar size='md' src={user.picturePath} name={user.name} />
         </MenuButton>
         <MenuList>
            <Flex gap='3' p={3} alignItems='center' {...getRootProps()}>
               <div className='user-avatar'>
                  <input {...getInputProps()} />
                  <Avatar size='full' src={user.picturePath} alt='Photo' loading='lazy' />
                  <span className='edit-av edit' onClick={open}>
                     {isLoadingUploadPicture ? <Spinner /> : <i className='material-icons'>edit</i>}
                  </span>
               </div>

               <Box>
                  <Heading size='sm' color='black'>
                     {user.name}
                  </Heading>
                  <Text color='black' fontSize='xs'>
                     {user.username}
                  </Text>
               </Box>
            </Flex>
            <MenuDivider />
            <Flex flexDirection='column' p={2}>
               <Button onClick={deleteUser} colorScheme='red' variant='ghost'>
                  Delete user
               </Button>
               <Button onClick={signOut} colorScheme='red' variant='ghost'>
                  Sign Out
               </Button>
            </Flex>
         </MenuList>
      </Menu>
   );
};

export default UserMenu;
