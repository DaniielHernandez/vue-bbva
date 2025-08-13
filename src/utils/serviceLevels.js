/*
 * This method is used to translate the filters to camelCase an english
 * for service level view
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return {Object[]} 
 */
export const translateFilters = (filters) => {
  const data = filters.map( (item) => ({ ...item }) );
  const translations = {
    date: "date", decimals: "decimals", availability: "availability",
    buId: 'buId', cfsId: 'cfsId', cbpId: 'cbpId', operativeId: 'operativeId'
  };
  const keys = Object.keys(translations);
  data.forEach((filter, index) => {
    if( keys.includes(filter.name) ) {
      data[index].name = translations[filter.name];
    }
  })
  return data;

}
