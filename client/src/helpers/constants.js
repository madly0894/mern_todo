export const MODAL_CONTENT_STYLE = {
   top: '50%',
   left: '50%',
   right: 'auto',
   bottom: 'auto',
   transform: 'translate(-50%, -50%)',
};
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:MM';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_CELL_FORMAT = 'DD MMMM YYYY';
export const QUERY_KEYS = {
   EMPLOYEES: 'employees',
   USER: 'user',
   PICTURE: 'picture',
};
export const API_KEYS = {
   EMPLOYEES: '/employees',
   EMPLOYEE: id => `/employees/${id}`,
   ADD_EMPLOYEE: '/employees/add',
   EDIT_EMPLOYEE: id => `/employees/${id}/edit`,
   EMPLOYEE_PICTURE: id => `/employees/${id}/picture`,
   DELETE_EMPLOYEE: id => `/employees/${id}/delete`,
   DELETE_EMPLOYEES: '/employees/delete',
   USER: '/user',
   USER_PICTURE: '/user/picture',
   UPDATE_USER: '/user/update',
   DELETE_USER: '/user/delete',
   SIGN_IN: '/auth/sign-in',
   SIGN_UP: '/auth/sign-up',
   SIGN_OUT: '/auth/sign-out',
   REFRESH: '/auth/refresh',
};

export const NAVIGATOR_KEYS = {
   BASE_URL: '/',
   SIGN_IN: '/auth/sign-in',
   SIGN_UP: '/auth/sign-up',
};

export const SERIALIZE_OPTIONS = {
   indices: true,
   nullsAsUndefineds: false,
   booleansAsIntegers: false,
   allowEmptyArrays: false,
};
