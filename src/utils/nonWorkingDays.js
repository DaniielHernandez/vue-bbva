/*
 * It creates options to be used in selects inputs
 * @param {String[]} data  Array with strings
 *
 * @return {Object[]} Object with the options {label: 'nameA' id: 'nameA' }
 */
export const singleOptions = (data) => {
  const options = []
  data.forEach((item) => {
    options.push({ id: item, label: item });
  });

  return options;
};

/*
 *  It return options of years for a select input, current year and next year
 *
 *  @return {Object[]} Array with options
 */
export const yearsOptions = () => {
  const currentYear = new Date().getFullYear();
  return [
    { id: currentYear, label: currentYear },
    { id: currentYear + 1, label: currentYear + 1 }
  ];
};

/*
 *  It checks if the year giden is biciesto
 *  @param {Number} item  Year
 *
 *  @return {Boolean} Flag, true is it's biciesto
 */
const bisiesto = (item) => {
  if(item % 400 === 0) {
    return true;
  }

  return (item % 100 === 0) ? false : item % 4 === 0;
};

/*
 * It returns the number of days of a months given a year
 *
 * @param {Number} year   Year to get month's days
 * @param {Number} month  Month to get number of days
 *
 * @return {Number}
 */
export const daysOptions = (year, month) => {
  const days = (limit) => [...Array(limit).keys()].map(i => i + 1);
  const data = (limit) => {
    return singleOptions( days(limit) );
  };

  const options = {
    1: data(31),
    2: data(bisiesto(year) ? 29 : 28),
    3: data(31),
    4: data(30),
    5: data(31),
    6: data(30),
    7: data(31),
    8: data(31),
    9: data(30),
    10: data(31),
    11: data(30),
    12: data(31),
  };
  return options[`${month}`];
};

/*
 * It has the options for the months to be used in a select
 */
export const monthsOptions = () => {
  const data = [1,2,3,4,5,6,7,8,9,10,11,12];
  return singleOptions(data);
};
