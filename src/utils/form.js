/*
 * This method validates if the parameter has a value, if not, then
 * it return an string with the mssage
 * @param {String|Number} value Value to validate
 *
 * @return {String} Message if the value is empty, null or undefined
 */
export const validateRequired = (value) => {
  if( Array.isArray(value) ) {
    if(value.length) {
      return '';
    }
    return 'Campo requerido';
  } else if(value) {
      return '';
  }

  return 'Campo requerido';
};

/*
 * It validates thje value has two decimals if not, the return a message
 * with the error
 * @param {Number} number Number
 *
 * @return {String} With message if there is an error
 */
export const validateTwoDecimal = (number) => {
  const numberAsString = number.toString();
  let decimals = 0;

  if (numberAsString.includes('.')) {
    decimals = numberAsString.split('.')[1].length;
  }

  if( decimals <= 2 ) {
    return '';
  }

  return 'Solo dos decimales';
};

/*
 * It validates if an email has the pattern required
 *
 * @param {String} email Email to validate
 *
 * @return {String} With message if there is an error
 */
export const validateEmail = (value) => {
  if ( !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ) {
    return 'Introduce un correo electrónico valido.';
  }

  return '';
};

/*
 * It execute any validations is there is any error then return a message with
 * the error
 *
 * @param {Function[]} validations  Function to validate an error
 * @param {Number|String}  value    Value to be validated
 *
 * @return {String} Message with the error if there is any
 */
export const manyValidations = (validations, value) => {
  let error = '';
  validations.every((validation) => {
    const message = validation(value);
    if( message ) {
      error = message;
      return false;
    }
    return true;
  });

  return error;
};

/*
 * It clears the inputs received
 * @param {String} keys Keys of the fields
 *
 * @return {Object[]} Array with objects {name: 'anyKeyName', value: null: error: ''}
 */
export const clearInputs = (keys) => {
  const inputs = {};
  keys.forEach( (name) => {
    inputs[name] = { error: '', value: null, touch: false };
  });
  return inputs;
}


/*
 * It checks if there is any error between the inputs
 *
 * @param {Object[]} inputs Arraoy of objects { name: 'anyFieldName', value: 'someValue', error: 'some error' }
 */
export const isThereError = ( inputs ) => {
  return !Object.values(inputs).find((input) => !!input.error);
};

/*
 * It validates if the value has a format percentage
 *
 * @param {String} value  String with the percentage
 *
 * @return {String} Message with the error if there is any
 */
export const validatePercentage = (value) => {
  if( /^\d+.?\d*%$/.test(value) ) {
    return '';
  }
  return 'Introduce un porcentage valido';
};

/*
 * It validates the number si between min and max
 * @param {Number} value Value to be validated
 * @param {Number} min   Maximum value allowed
 * @param {Number} max   Minumum value allowed
 *
 * @return {String} Message with the error if there is any
 */
export const validateNumber = (value, min, max) => {
  if( value < min ) {
    return `El número no puede ser menor a ${min}`;
  } else if( value > max) {
    return `El número no puede ser mayor a ${max}`;
  }
  return '';
}

/*
 * It validates the inputs given the validations
 *
 * @param {Function[]} validations  Validation's functions
 * @param {Object[]}   inputs       Array of inputs {name: 'someFieldName', value: 'someValue', error: ''}
 *
 * @return {Boolean} Flag, true if the validations no raise any error
 */
export const validateAllFields = (validations, inputs ) => {
  const validated = {...inputs};
  Object.keys(validations).forEach( (field) => {
     validated[field].error = validations[field]( inputs[field].value );
  });
  return validated;
};


/*
 * It parses the catalogs with format { id: 23, label:_ 'Some label'}
 *
 * @param {Object[]} catalog Array with items to be parsed
 *
 * @return {Object[]} Array with objects parsed
 */
export const parseCatalog = (catalog) => {
  const data = [];
  const array = catalog.items || catalog;
  array.forEach((item) => {
    data.push({id:  item.id, label: item?.fullname || item?.completeName || item?.title || item?.bu || item?.name});
  });
  return data;
};
