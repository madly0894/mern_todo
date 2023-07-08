import * as React from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getUsers } from './api/users.api';
import AddUserModal from './modals/AddUserModal';
import EditUserModal from './modals/EditUserModal';
import { API_KEY } from './constants';
import { Block, Confirm } from 'notiflix';
import dayjs from 'dayjs';
import { combineValues } from './utils';
import { useInView } from 'react-cool-inview';

function App() {
   const queryClient = useQueryClient();

   const [addUserModal, setAddUserModal] = React.useState(false);
   const [editUserModal, setEditUserModal] = React.useState(false);

   const {
      data: { pages = [] } = {},
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteQuery({
      queryKey: [API_KEY],
      queryFn: getUsers,
      retry: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allPages) => lastPage.pagination.hasNextPage && lastPage.pagination.nextPage,
   });

   const { mutate } = useMutation({
      mutationFn: deleteUser,
      onMutate: () => {
         Block.hourglass('.App-content', 'Please wait...');
      },
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [API_KEY] });
      },
      onSettled: () => {
         Block.remove('.App-content');
      },
   });

   const { observe } = useInView({
      // For better UX, we can grow the root margin so the data will be loaded earlier
      // rootMargin: '50px 0',
      // When the last item comes to the viewport
      onEnter: ({ unobserve }) => {
         // Pause observe when loading data
         unobserve();
         // Load more data
         if (!!hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
         }
      },
   });

   const onDeleteUser = userId => {
      Confirm.show('Delete User', 'Are you sure you want to delete this user?', 'Yes', 'No', () => {
         mutate(userId);
      });
   };

   return (
      <div className='App'>
         <h1 className='title'>
            List of <span className='inline-text'>Users</span>
         </h1>

         <div className='App-content'>
            <div className='table'>
               <table>
                  <thead>
                     <tr className='thead'>
                        <th>
                           <button className='action add-action' onClick={() => setAddUserModal(true)}>
                              <i className='material-icons'>add</i>
                           </button>
                        </th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Date of birth</th>
                        <th>Age</th>
                        <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {combineValues(pages).map((user, index, array) => (
                        <tr key={user._id} className='tbody' ref={(index === array.length - 1 && observe) || null}>
                           <td>{index + 1}</td>
                           <td>{user.name}</td>
                           <td>{user.surname}</td>
                           <td>{dayjs(user.dateOfBirth).format('DD MMMM YYYY')}</td>
                           <td>{user.age}</td>
                           <td>
                              <div className='actions'>
                                 <button onClick={() => setEditUserModal(user._id)} className='action edit-action'>
                                    <i className='material-icons'>edit</i>
                                 </button>
                                 <button onClick={() => onDeleteUser(user._id)} className='action delete-action'>
                                    <i className='material-icons'>delete</i>
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <AddUserModal show={addUserModal} onHide={() => setAddUserModal(false)} />
         <EditUserModal show={editUserModal} onHide={() => setEditUserModal(false)} />
      </div>
   );
}

export default App;
