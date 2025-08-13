export const translateMonth = (month) => {  
  const monthsCapital = {
    January: 'Enero', February: 'Febrero', April: 'Abril', March: 'Marzo', May: 'Mayo',
    June: 'Junio', July: 'Julio', August: 'Agosto', September: 'Septiembre', October: 'Octubre', 
    November: 'Noviembre', December: 'Diciembre'
  };

  const choosen = Object.keys(monthsCapital).find( (key) => ( key.toLowerCase() === month.toLowerCase() ) );
  return month.match('[A-Z]') === null ? monthsCapital[choosen].toLowerCase() :
    monthsCapital[choosen];
};
