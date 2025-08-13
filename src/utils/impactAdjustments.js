/*
 * It creates an object to use for showing the data into the table
 * @param {Object[]} data  Data got from the aPI to show impact adjustments table
 *
 * @return {Object} Object with the data formated
 */
export const parseDataTable = (data) => {
  const dataTable = {};
  data.forEach( (item) => {
    dataTable[item.id] = {...item};
  });
  return dataTable;
};
