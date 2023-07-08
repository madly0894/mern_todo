import * as React from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAllUsers, deleteUser, getUsers } from './api/users.api';
import AddUserModal from './modals/AddUserModal';
import EditUserModal from './modals/EditUserModal';
import { API_KEY } from './constants';
import { Confirm } from 'notiflix';
import dayjs from 'dayjs';
import { combineValues } from './utils';
import { useInView } from 'react-cool-inview';

function App() {
   const queryClient = useQueryClient();

   const [addUserModal, setAddUserModal] = React.useState(false);
   const [editUserModal, setEditUserModal] = React.useState(false);
   const [selectedRowIds, setSelectedRowIds] = React.useState([]);

   const {
      data: pages = [],
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteQuery({
      queryKey: [API_KEY],
      queryFn: getUsers,
      retry: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allPages) => lastPage.hasNextPage && lastPage.nextPage,
      select: data => combineValues(data.pages),
   });

   const { mutate: mutateDeleteUser } = useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [API_KEY] });
         setSelectedRowIds([]);
      },
   });

   const { mutate: mutateDeleteAllUsers } = useMutation({
      mutationFn: deleteAllUsers,
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [API_KEY] });
         setSelectedRowIds([]);
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
         mutateDeleteUser(userId);
      });
   };

   const onDeleteAllUsers = ids => {
      Confirm.show('Delete All Users', 'Are you sure you want to delete all users?', 'Yes', 'No', () => {
         mutateDeleteAllUsers(ids);
      });
   };

   return (
      <div className='App'>
         <h1 className='title'>
            List of <span className='inline-text'>Users</span>
         </h1>

         <div className='App-content'>
            <div className={`table ${pages.length >= 10 ? 'box' : ''}`}>
               <table>
                  <thead>
                     <tr className={'thead'}>
                        <th>
                           <input
                              type='checkbox'
                              checked={pages.length !== 0 && selectedRowIds.length === pages.length}
                              disabled={pages.length === 0}
                              onChange={e => {
                                 // add list
                                 if (e.target.checked) {
                                    setSelectedRowIds(pages.map(d => d._id));
                                 } else {
                                    // remove list
                                    setSelectedRowIds([]);
                                 }
                              }}
                           />
                        </th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Date of birth</th>
                        <th>Age</th>
                        <th>
                           <div className='actions'>
                              <button
                                 title='Add user'
                                 className='action add-action'
                                 onClick={() => setAddUserModal(true)}
                              >
                                 <i className='material-icons'>add</i>
                              </button>

                              <button
                                 title='Delete all users'
                                 className='action delete-action'
                                 disabled={selectedRowIds.length === 0}
                                 onClick={() => onDeleteAllUsers(selectedRowIds)}
                              >
                                 <i className='material-icons'>delete_forever</i>
                              </button>
                           </div>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {pages.map((user, index, array) => (
                        <tr
                           key={user._id}
                           className='tbody'
                           ref={(index === array.length - 1 && observe) || null}
                           aria-selected={selectedRowIds.some(id => id === user._id)}
                        >
                           <td>
                              <input
                                 type='checkbox'
                                 checked={selectedRowIds.some(id => id === user._id)}
                                 onChange={e => {
                                    // add to list
                                    if (e.target.checked) {
                                       setSelectedRowIds(prev => [...prev, user._id]);
                                    } else {
                                       // remove from list
                                       setSelectedRowIds(prev => prev.filter(id => id !== user._id));
                                    }
                                 }}
                              />
                           </td>
                           <td>{user.name}</td>
                           <td>{user.surname}</td>
                           <td>{dayjs(user.dateOfBirth).format('DD MMMM YYYY')}</td>
                           <td>{user.age}</td>
                           <td>
                              <div className='actions'>
                                 <button
                                    title='Edit user'
                                    onClick={() => setEditUserModal(user._id)}
                                    className='action edit-action'
                                    disabled={
                                       selectedRowIds.length !== 0 && selectedRowIds.every(id => id !== user._id)
                                    }
                                 >
                                    <i className='material-icons'>edit</i>
                                 </button>
                                 <button
                                    title='Delete user'
                                    onClick={() => onDeleteUser(user._id)}
                                    className='action delete-action'
                                    disabled={
                                       selectedRowIds.length !== 0 && selectedRowIds.every(id => id !== user._id)
                                    }
                                 >
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
