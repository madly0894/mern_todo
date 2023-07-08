export const combineValues = values => {
   return values.reduce((previousValue, currentValue) => {
      previousValue.push(...currentValue.data);
      return previousValue;
   }, []);
};
