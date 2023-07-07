import './App.scss';
import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getUsers } from './api/users.api';
import AddUserModal from './modals/AddUserModal';
import EditUserModal from './modals/EditUserModal';
import { API_KEY } from './constants';
import { Block, Confirm } from 'notiflix';
import dayjs from 'dayjs';

function App() {
   const queryClient = useQueryClient();

   const [addUserModal, setAddUserModal] = React.useState(false);
   const [editUserModal, setEditUserModal] = React.useState(false);

   const { data = [] } = useQuery({
      queryKey: [API_KEY],
      queryFn: getUsers,
      retry: false,
      refetchOnWindowFocus: false,
   });

   const { mutate } = useMutation({
      mutationFn: deleteUser,
      onMutate: () => {
         Block.hourglass('.table', 'Please wait...');
      },
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [API_KEY] });
      },
      onSettled: () => {
         Block.remove('.table');
      },
   });

   const onDeleteUser = userId => {
      Confirm.show('Delete User', 'Are you sure you want to delete this user?', 'Yes', 'No', () => {
         mutate(userId);
      });
   };

   return (
      <div className='App'>
         <h1 className='title'>List of Users</h1>

         <div className='table'>
            <table>
               <thead>
                  <tr>
                     <th>Name</th>
                     <th>Surname</th>
                     <th>Date of birth</th>
                     <th>Age</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {data.map(user => (
                     <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.surname}</td>
                        <td>{dayjs(user.dateOfBirth).format('DD MMMM YYYY')}</td>
                        <td>{user.age}</td>
                        <td>
                           <div className='actions'>
                              <button onClick={() => setEditUserModal(user._id)} className='action edit-action'>
                                 Edit <i className='material-icons'>edit</i>
                              </button>
                              <button onClick={() => onDeleteUser(user._id)} className='action delete-action'>
                                 Delete <i className='material-icons'>delete</i>
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            <button className='fab add-action' onClick={() => setAddUserModal(true)}>
               <i className='material-icons'>add</i>
            </button>
         </div>

         <AddUserModal show={addUserModal} onHide={() => setAddUserModal(false)} />
         <EditUserModal show={editUserModal} onHide={() => setEditUserModal(false)} />
      </div>
   );
}

export default App;
