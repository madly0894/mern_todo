import * as React from 'react';
import { Confirm } from 'notiflix';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
   Menu,
   MenuButton,
   MenuList,
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
import { QUERY_KEYS } from '../helpers/constants';
import { uploadUserPicture } from '../api/user.api';

const UserMenu = () => {
   const queryClient = useQueryClient();
   const user = queryClient.getQueryData([QUERY_KEYS.USER]);

   const signOutMutation = useSignOut();
   const deleteUserMutation = useDeleteUser();

   const { mutate: mutateUploadUserPicture, isLoading: isLoadingUploadPicture } = useMutation({
      mutationFn: uploadUserPicture,
      onSuccess: (data, variables) => {
         // Invalidate and refetch
         queryClient.setQueryData([QUERY_KEYS.USER], input => ({
            ...input,
            picturePath: URL.createObjectURL(variables),
         }));
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

   return (
      <Menu placement='bottom-end'>
         <MenuButton as={Button} p={0} colorScheme='black'>
            <Avatar size='md' src={user.picturePath} name={user.name} loading='lazy' />
         </MenuButton>
         <MenuList>
            <Flex gap='3' p={3} alignItems='center'>
               <div className='user-avatar' {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className='file-img'>
                     <Avatar size='lg' src={user.picturePath} name={user.name} alt='Photo' loading='lazy' />
                     <span className='edit-av edit' onClick={open}>
                        {isLoadingUploadPicture ? <Spinner /> : <i className='material-icons'>edit</i>}
                     </span>
                  </div>
               </div>

               <Box>
                  <Heading size='sm' color='black'>
                     {user.name}
                  </Heading>
                  <Text color='black' fontSize='xs'>
                     @{user.username}
                  </Text>
               </Box>
            </Flex>
            <MenuDivider />
            <Flex className='menu-list' flexDirection='column' p={3}>
               <Button onClick={deleteUser} colorScheme='red'>
                  Delete user
               </Button>
               <Button onClick={signOut} colorScheme='gray'>
                  Sign out
               </Button>
            </Flex>
         </MenuList>
      </Menu>
   );
};

export default UserMenu;
