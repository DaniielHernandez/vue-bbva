/*
 * This method find the index by key and value from an array
 *
 * @param {Array}   array   Array
 * @param {String}  key     Field's key
 * @param {String|number}   Field's value
 *
 * @return Number index of the item
 */
export const findIndexByKeyValue = (array, key, value) => {
  return array.findIndex((item) => item[key] === value);
}

/*
 * This method gets the string for today date
 *
 * @return String with the current date
 */
export const stringToday = () => {
  const a = new Date();
  const today = a.getDate();
  const currentMonth = a.getMonth() + 1;
  const month = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
  const day = today < 10 ? `0${today}` : today;

  return `${a.getFullYear()}-${month}-${day}`;
}

/*
 * This method gets the last day from a month
 *
 * @param {Number} year
 * @param {Number} month
 *
 * @return  Number
 */
export const lastday = function(year, month){
  return  new Date(year, month +1, 0).getDate();
}

/*
 * This method gets the las day from a month with a date YYYY-MM-DD
 *
 * @return String
 */
export const getDateLastday = (month, year) => {
  const last = lastday(year, month);
  const day = last < 10 ? `0${last}` : last;
  const dateMonth = (month + 1) < 10 ? `0${month + 1}` : month + 1;

  return `${year}-${dateMonth}-${day}`;
}

/*
 * This method get the month fram an string date with the format YYYY-MM-DD
 * @param {String} date Date
 * @return Number
 */
export const getMonthFromString = (date) => {
  return parseInt( date.substring(5,7) );
}

/*
 * This method gets the year form an string date  with the format YYYY-MM-DD
 * @param {String} date Date
 * @return Number
 */
export const getYearFromString = (date) => {
  return parseInt( date.substring(0,4) );
}

/*
 * This method gets the day form an string date  with the format YYYY-MM-DD
 * @param {String} date Date
 * @return Number
 */
export const getDayFromString = (date) => {
  return parseInt( date.substring(8,11) );
}

/*
 * This method create string with a date  with specific format,
 * example: 07 de Octubre de 1989
 *
 * @param {String} date Date
 *
 * @return String
 */
export const formatStringDate = (date) => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo',
    'junio', 'julio', 'agosto', 'septiembre', 'octubre',
    'noviembre', 'diciembre',
  ];
  const day = getDayFromString( date );
  const year = getYearFromString( date );
  const month = months[getMonthFromString(date) - 1];
  return `${day} de ${month} de ${year}`;
};

/*
 * It sets dat string into the date string
 * @param {String} day   Day
 * @param {String} date  Date
 * @return String
 */
export const setDayStringDate = (day, date) => {
  const number = parseInt(day);
  const stringDay = number < 10 ? `0${number}` : `${number}`;
  return date.substring(0,4) + '-' + date.substring(5,7) + '-' + stringDay
};

/**
 * Adds a specified number of minutes to a given time.
 *
 * @param {string} currentTime - The current time in the format "HH:MM".
 * @param {number} minutesToAdd - The number of minutes to add to the current time.
 * @return {string} The new time after adding the specified number of minutes in the format "HH:MM".
 */
export const addMinutesToTime = (currentTime, minutesToAdd) => {
  if (!currentTime || !minutesToAdd) return
  const [hours, minutes] = currentTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + minutesToAdd
  let newHour = Math.floor(totalMinutes / 60) % 24
  let newMinutes = totalMinutes % 60
  if ( newHour === 0 && newMinutes === 0 ){
    newHour = 23
    newMinutes = 59
  }
  return `${String(newHour).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

/**
 * Format a date with slashes.
 *
 * @param {string} date - The date to be formatted (in the format "YYYY-MM-DD").
 * @return {string} The formatted date (in the format "DD/MM/YYYY").
 */
export const formatDateWhitSlash = (date) => {
  if (!date) return
  const [year, month, day] = date.split('-').map(Number)
  const dateObject = new Date(year, month - 1, day)
  const formattedDay = dateObject.getDate().toString().padStart(2, '0')
  const formattedMonth = (dateObject.getMonth() + 1).toString().padStart(2, '0')
  const formattedYear = dateObject.getFullYear()
  const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`
  return formattedDate
}

/**
 * Format a date with dashes.
 *
 * @param {string} date - The date to be formatted (in the format "YYYY/MM/DD").
 * @return {string} The formatted date (in the format "YYYY-MM-DD").
 */
export const formatDateWhitDash = (date) => {
  if (!date) return
  const [year, month, day] = date.split('/').map(Number)
  const dateObject = new Date(year, month - 1, day)
  const formattedDay = dateObject.getDate().toString().padStart(2, '0')
  const formattedMonth = (dateObject.getMonth() + 1).toString().padStart(2, '0')
  const formattedYear = dateObject.getFullYear()
  const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`
  return formattedDate
}

/*
 * This method convert an string snack case to camel case
 * @param {String} str String to parse
 *
 * @return {String}
 */
const camelCase = ( str ) => {
 if( !str.includes('_') ) {
   return str;
 }

 return  str.toLowerCase().replace(/(_\w)/g, m => m.toUpperCase().substr(1));
};

/*
 * This method convert the filter names to camelCase
 *
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return {Object[]}
 */
export const filtersCamelCase = (filters) => {
  const data = [];
  filters.forEach( (item) => {
    data.push({name: camelCase(item.name), value: item.value })
  });
  return data;
};

/*
 * It clones an array
 *
 * @param {Object[]} array Array to be cloned
 *
 * @return {Object[]} Array cloned
 */
export const cloneArrayOfObjects = (array) => {
  const clone = [];
  array.forEach((item) => {
    clone.push({...item});
  });
  return clone;
};

/*
 * It formats a number given
 * @param {Number} Number to be formated
 * @return String
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat().format( number );
}

/*
 * It creates an string in format query params
 * @param {Object[]}  params           Params to send into the request
 * @param {String}    params[].name    Name of the parameter
 * @param {String|Number}    params[].value   Value of the parameter, the type can be different
 * @return String
 */
export const createQueryParams = (params) => {
  let query = '';
  params.forEach((param) => {
    query += `${param.name}=${param.value}&`;
  });
  return query;
}

/*
 * It replace a key by another one
 * @param Object Object
 * @param key1 First key
 * @param key2 Second key
 */
export const replaceKey = (object, key1, key2) => {
  object[key2]  = object[key1];
  delete object[key1];
}

/*
 * It compares two string dates, taking into accountg the next
 * start > end return -1
 * start < end return 1
 * start = end return 0
 *
 * @return Number, result of compare the dates
 *
 */
export const compareStringDates = (start, end) => {
  if( start === end ) {
    return 0;
  }
  const yearStart = getYearFromString(start);
  const yearEnd = getYearFromString(end);

  const monthStart = getMonthFromString(start);
  const monthEnd = getMonthFromString(end);
  
  const dayStart = getDayFromString(start);
  const dayEnd = getDayFromString(end);
  
  if( yearStart > yearEnd ) {
    return -1;
  } else if(yearStart < yearEnd ) {
    return 1;
  } else if( 
     (monthStart > monthEnd) ||
    (monthStart === monthEnd && dayStart > dayEnd)
  ) {
    return -1;
  } else {
    return 1;
  }
};
