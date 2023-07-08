export const combineValues = values => {
   return values.reduce((previousValue, currentValue) => {
      previousValue.push(...currentValue.data);
      return previousValue;
   }, []);
};

export const getOwnYear = (count = 0) => {
   const date = new Date();
   const year = date.getFullYear();
   const month = date.getMonth();
   const day = date.getDate();
   return new Date(year - count, month, day).toDateString();
};
