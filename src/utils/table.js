import { separator } from '@/constants/general';

/*
 * This method  helps to prepare a field to be splited to be showed into the table
 * example itemOne Mexico itemTwo America , the the string Mexico%##%America, where speratir is %##%
 *
 * @param {String} itemOne   Firts part of to joing the string
 * @param {String} itemTwo   Second part to join to string
 * @return String
 */
export const getSplitValue = (itemOne, itemTwo) => {
  if(['América','Global','Europa'].includes(itemOne) ) {
    return (itemOne || '') + separator + (itemTwo || 'Todas')
  }
  return (itemOne || '') + separator + (itemTwo || '');
};

/*
 * It helps to build the data to be showed by the component DataTable
 *
 * @param {Object[]}  data   Array with objects for each row
 * @param {String[]}  keys   Array with the keys to be showed
 *
 * @return Array
 */
export const buildData = (data, keys) => {
  const build = {};
  data.items.forEach( (item) => {
    build[item.id] = keys.map( (key) => {
      let value = item[key];
      if( key.includes(separator) ) {
        const key1 = key.split(separator)[0];
        const key2 = key.split(separator)[1];
        value = getSplitValue(item[key1], item[key2])
      }
      return { value, name: key }
    });
  });
  return build;
};
