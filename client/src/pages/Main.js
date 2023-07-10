import * as React from 'react';
import * as dayjs from 'dayjs';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAllEmployees, deleteEmployee, getEmployees } from '../api/employees.api';
import AddEmployeeModal from '../modals/AddEmployeeModal';
import EditEmployeeModal from '../modals/EditEmployeeModal';
import { QUERY_KEY, DATE_CELL_FORMAT } from '../constants';
import { Confirm } from 'notiflix';
import { combineValues } from '../utils';
import { useInView } from 'react-cool-inview';

const Main = () => {
   const queryClient = useQueryClient();

   const [addEmployeeModal, setAddEmployeeModal] = React.useState(false);
   const [editEmployeeModal, setEditEmployeeModal] = React.useState(false);
   const [selectedRowIds, setSelectedRowIds] = React.useState([]);

   const {
      data: pages = [],
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteQuery({
      queryKey: [QUERY_KEY.employees],
      queryFn: getEmployees,
      retry: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allPages) => lastPage.hasNextPage && lastPage.nextPage,
      select: data => combineValues(data.pages),
   });

   const { mutate: mutateDeleteEmployee } = useMutation({
      mutationFn: deleteEmployee,
      onSuccess: (data, variables, context) => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees] });
         // Reset selected rows
         setSelectedRowIds([]);
      },
   });

   const { mutate: mutateDeleteAllEmployees } = useMutation({
      mutationFn: deleteAllEmployees,
      onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees] });
         // Reset selected rows
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

   const onToggleRow = ({ isChecked, employeeId }) => {
      // add to list
      if (isChecked) {
         setSelectedRowIds(prev => [...prev, employeeId]);
      } else {
         // remove from list
         setSelectedRowIds(prev => prev.filter(id => id !== employeeId));
      }
   };

   const onToggleAllRows = isChecked => {
      // add list
      if (isChecked) {
         setSelectedRowIds(pages.map(d => d._id));
      } else {
         // remove list
         setSelectedRowIds([]);
      }
   };

   const onDeleteUser = userId => {
      Confirm.show('Delete Employee', 'Are you sure you want to delete this employee?', 'Yes', 'No', () => {
         mutateDeleteEmployee(userId);
      });
   };

   const onDeleteAllUsers = ids => {
      Confirm.show('Delete All Employees', 'Are you sure you want to delete all employees?', 'Yes', 'No', () => {
         mutateDeleteAllEmployees(ids);
      });
   };

   return (
      <main>
         <div className='App-content'>
            <div className={`table-container ${pages.length >= 10 ? 'box' : ''}`}>
               <table>
                  <thead>
                     <tr className={'thead'}>
                        <th>
                           <input
                              type='checkbox'
                              checked={pages.length !== 0 && selectedRowIds.length === pages.length}
                              disabled={pages.length === 0}
                              onChange={e => onToggleAllRows(e.target.checked)}
                           />
                        </th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Date of birth</th>
                        <th>Age</th>
                        <th>
                           <div className='actions'>
                              <button
                                 title='Add employee'
                                 className='action add-action'
                                 onClick={() => setAddEmployeeModal(true)}
                              >
                                 <i className='material-icons'>add</i>
                              </button>

                              <button
                                 title='Delete all users'
                                 className='action delete-action'
                                 disabled={selectedRowIds.length === 0}
                                 onClick={e => onDeleteAllUsers(selectedRowIds)}
                              >
                                 <i className='material-icons'>delete_forever</i>
                              </button>
                           </div>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {pages.map((employee, index, array) => {
                        const isCheckedItem = selectedRowIds.some(id => id === employee._id);

                        return (
                           <tr
                              key={employee._id}
                              className='tbody'
                              ref={(index === array.length - 1 && observe) || null}
                              aria-selected={isCheckedItem}
                           >
                              <td>
                                 <input
                                    type='checkbox'
                                    checked={isCheckedItem}
                                    onChange={e =>
                                       onToggleRow({ isChecked: e.target.checked, employeeId: employee._id })
                                    }
                                 />
                              </td>
                              <td>{employee.name}</td>
                              <td>{employee.surname}</td>
                              <td>{dayjs(employee.dateOfBirth).format(DATE_CELL_FORMAT)}</td>
                              <td>{employee.age}</td>
                              <td>
                                 <div className='actions'>
                                    <button
                                       title='Edit employee'
                                       onClick={e => setEditEmployeeModal(employee._id)}
                                       className='action edit-action'
                                       disabled={
                                          selectedRowIds.length !== 0 && selectedRowIds.every(id => id !== employee._id)
                                       }
                                    >
                                       <i className='material-icons'>edit</i>
                                    </button>
                                    <button
                                       title='Delete employee'
                                       onClick={e => onDeleteUser(employee._id)}
                                       className='action delete-action'
                                       disabled={
                                          selectedRowIds.length !== 0 && selectedRowIds.every(id => id !== employee._id)
                                       }
                                    >
                                       <i className='material-icons'>delete</i>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>

         <AddEmployeeModal show={addEmployeeModal} onHide={() => setAddEmployeeModal(false)} />
         <EditEmployeeModal show={editEmployeeModal} onHide={() => setEditEmployeeModal(false)} />
      </main>
   );
};

export default Main;
