/*
 * It create a query to be used in requests with filters and/or paragination
 *
 * @param {Object[]} filters  Array with the filters with format {name: 'someName' value: 'someValue' }
 * @param {Number} pageSize    Page's size
 * @param {Number} pageNumber  Page's number
 *
 * @return {Object}
 */
export const queryFilter = ( filters, pageSize = null, pageNumber = null) => {
  let query = {};
  filters.forEach((item) => {
    query[item.name]=  item.value;
  })
  if(pageSize !== null) query.pageSize = pageSize;
  if(pageNumber !== null) query.pageNumber = pageNumber;
  return query;
};

