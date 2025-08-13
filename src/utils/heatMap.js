import { getDayFromString, setDayStringDate } from  '@/utils/general';

/*
 * It creates the header days to be showed by the heat maps
 * @param {String} date Date
 * @return Array with the headers
 */
export const getHeadersDays = (date) => {
  const days = getDayFromString(date);
  const headers = [];

  for(let i = 1; i <= days ; i++) {
    const day = i < 10 ? `0${i}` : `${i}`;
    headers.push({label: day, date: setDayStringDate(day, date) });
  }
  return headers;
}
