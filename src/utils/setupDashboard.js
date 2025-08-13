import { getSplitValue } from '@/utils/table';
import { separator } from '@/constants/general';

/*
 * This method build the data be showed into the table
 * for dashboard view
 * @param {Object[]}  data        Array with the objects and its data to be showeb by the table
 * @param {String[]}  keys        Array with the field'sname to be showed in every row
 * @param {String[]}  hiddenKeys  Array with the hidden field's to be showeb by the table per row
 * @return Array
 */
export const buildData = (data, keys, hiddenKeys) => {
  const build = {};
  data.items.forEach( (item) => {
    build[item.id] = keys.map( (key) => {
      let value = item[key];
      if( key === 'roles' ) {
        value = '';
        item.roles.forEach( (role, index) => {
          value += role.nameRole + (index !== item.roles.length - 1 ? ', ' : '');
        });
      } else if( key.includes(separator) ) {
        const key1 = key.split(separator)[0];
        const key2 = key.split(separator)[1];
        value = getSplitValue(item[key1], item[key2])
      }
      return { value, name: key }
    });


    if( hiddenKeys.length ) {
      build[`${item.id}-hidden`] = hiddenKeys.map( (key) => {
        let value = item[key];
        return { value, name: key }
      });
    }
  });
  return build;
};
