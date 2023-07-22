import * as React from 'react';
import { AuthContext } from '../Auth';

export default function useUser() {
   const context = React.useContext(AuthContext);
   if (context === undefined) {
      throw new Error('...');
   }
   return context;
}
