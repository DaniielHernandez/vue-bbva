import {
  validateRequired, validateEmail, manyValidations
} from '@/utils/form';

/*
 * Form's validations
 */
export const validationsExecuteForm = {
  buId: (value) => validateRequired(value),
  modelId: (value) => validateRequired(value),
  startDate: (value) => validateRequired(value),
  startHour: (value) => validateRequired(value),
  endDate: (value) => validateRequired(value),
  endHour: (value) => validateRequired(value)
};

export const operatorsIds = {
  biggerThan: 1,
  lowerThan: 2,
  equals: 3,
  betweenValues: 4,
  different: 5
}

export const executionPeriodsIds = {
  daily: 1,
  monthly: 2,
  weekly: 3,
  day: 4,
  nonWorkingDay: 5,
  onDemand: 6
};

export const timePeriodsIds = {
  untilDay: 1,
  timeInterval: 2,
  day: 3, 
  month: 4
};
