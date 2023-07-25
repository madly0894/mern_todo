class Utils {
   static getOwnYear(count) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return new Date(year - count, month, day).toDateString();
   }
   static combineValues(values) {
      return values.reduce((previousValue, currentValue) => {
         previousValue.push(...currentValue.data);
         return previousValue;
      }, []);
   }
   static setAccessToken(accessToken) {
      return localStorage.setItem('accessToken', accessToken);
   }
   static getAccessToken() {
      return localStorage.getItem('accessToken');
   }
   static removeAccessToken() {
      return localStorage.removeItem('accessToken');
   }
   static traverse(obj) {
      let values = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key in obj) {
         if (typeof obj[key] === 'object' && obj[key] !== null) {
            values = values.concat(this.traverse(obj[key]));
         } else {
            values.push(obj[key]);
         }
      }
      return values;
   }
}

export default Utils;
