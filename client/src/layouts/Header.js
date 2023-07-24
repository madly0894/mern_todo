import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Confirm } from 'notiflix';
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
} from '@chakra-ui/react';
import { useSignOut } from '../hooks/useSignOut';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useQueryClient } from '@tanstack/react-query';
import { NAVIGATOR_KEYS, QUERY_KEYS } from '../helpers/constants';

const pathnames = {
   [NAVIGATOR_KEYS.BASE_URL]: (
      <>
         List of <span className='inline-text'>Employees</span>
      </>
   ),
   [NAVIGATOR_KEYS.SIGN_IN]: 'Sign In',
   [NAVIGATOR_KEYS.SIGN_UP]: 'Sign Up',
};

const Header = () => {
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

   return (
      <header>
         <Heading as='h1' className='title'>
            {pathnames[location.pathname]}
         </Heading>

         {!user ? (
            <ul className='right-block'>
               <li>
                  <NavLink to={NAVIGATOR_KEYS.SIGN_IN}>Sign In</NavLink>
               </li>
               <li>
                  <NavLink to={NAVIGATOR_KEYS.SIGN_UP}>Sign Up</NavLink>
               </li>
            </ul>
         ) : (
            <div className='right-block'>
               <p>
                  {user.name} (@{user.username})
               </p>

               <Menu>
                  <MenuButton as={Button} colorScheme='black'>
                     <Avatar size='md' src={user.picturePath} name={user.name} />
                  </MenuButton>
                  <MenuList>
                     <Flex gap='3' p={3} alignItems='center'>
                        <Avatar src='https://bit.ly/sage-adebayo' size='lg' />

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
            </div>
         )}
      </header>
   );
};

export default Header;
