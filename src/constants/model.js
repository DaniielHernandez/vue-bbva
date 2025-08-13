import { validateRequired } from '@/utils/form';
import { stringToday } from '@/utils/general';
/*
 * It formats ther version 
 */
const formatVersion = (number) => {
  const numberAsString = number.toString();
  let decimals = 0;

  if (numberAsString.includes('.')) {
    decimals = numberAsString.split('.')[1].length;
  }

  if( decimals === 2 ) {
    return '';
  }

  return 'Formato requerido dd.dd';
};

export const dataOperativa = {
  id:null,
  name: null,
  urls: [{
    variableElement: null,
    thresholdTr: null,
    isMother: false,
    isAccess: false,
  }]
};

export const dataCBPS = {
  id:null,
  name: null,
  number: 1,
  operatives: [{ ...dataOperativa }]
};

export const dataVentana = {
  startDay: null,
  startHour: null,
  endDay: null,
  endHour: null,
  holidays: false
};

export const dataFirstSection = {
  buId: null,
  cfsId: null,
  serviceOwnerId: null,
  criticalityId: null,
  environmentId: null,
  rfoClp: false,
  statusId: null,
  measurementStatusId: null,
  typeModelId: null,
  sourceId: null,
  version: null,
  metaAvailability: null,
  metaTimeResponse: null,
  levelsService: false,
  timesAnswer: false,
  dischargeDate: stringToday(),
  activationDate: null,
  inactivationDate: null,
  datePeriodWarranty: null,
  dateStartOfficial: null,
  dateStartVersion: null,
  partnershipId: null,
  measurementStatusPartnershipId: null,
  metaPartnershipExpected: null,
  metaPartnershipMinimum: null,
  dateStartPartnershipInitial: null,
  dateStartPartnershipAsIs: null,
  windowsGeneral:[ {...dataVentana}]
};

export const dataSecondSection = {
  modelId: null,
  cbps: [
    {
      name: null,
      number: 1,
      operatives: [
        {
          name: null,
          urls: [{
            variableElement: null,
            thresholdTr: null,
            isMother: false,
            isAccess: false
          }]
        }
      ]
    }
  ]
};

export const days = [ 
  { id: 1, label: 'Lunes'},
  { id: 2, label: 'Martes'},
  { id: 3, label: 'Miércoles'},
  { id: 4, label: 'Jueves'},
  { id: 5, label: 'Viernes'},
  { id: 6, label: 'Sábado'},
  { id: 7, label: 'Domingo'},
]

export const getDayLabel = (number) => {
  const day = days.find( (item) => item.id === number);

  return day.label;
}

export const validationsVentana = {
  startDay: (value) => validateRequired(value),
  startHour: (value) => validateRequired(value),
  endDay: (value) => validateRequired(value),
  endHour: (value) => validateRequired(value),
  holidays: (value) => ''
};

export const validateFirstSection = {
    buId: (value) => validateRequired(value),
    cfsId: (value) => validateRequired(value),
    serviceOwnerId: (value) => validateRequired(value),
    criticalityId: (value) => validateRequired(value),
    environmentId: (value) => validateRequired(value),
    rfoClp: (value) => '',
    statusId: (value) => validateRequired(value),
    measurementStatusId: (value) => validateRequired(value),
    typeModelId: (value) => validateRequired(value),
    sourceId: (value) => validateRequired(value),
    version: (value) => validateRequired(value),
    metaAvailability: (value) => validateRequired(value),
    metaTimeResponse: (value) => validateRequired(value),
    levelsService: (value) => '',
    timesAnswer: (value) => '',
    dischargeDate: (value) => validateRequired(value),
    activationDate: (value) => '',
    inactivationDate: (value) => '',
    datePeriodWarranty: (value) => '',
    dateStartOfficial: (value) => '',
    dateStartVersion: (value) => validateRequired(value),
    partnershipId: (value) => validateRequired(value),
    measurementStatusPartnershipId: (value) => '',
    metaPartnershipExpected: (value) => '',
    metaPartnershipMinimum: (value) => '',
    dateStartPartnershipInitial: (value) => '',
    dateStartPartnershipAsIs: (value) => ''
}

export const validateCbps = {
  name: (value) => validateRequired(value),
}
export const validateOperative = {
  name: (value) => validateRequired(value),
};

export const validateUrl = {
  variableElement: (value) => validateRequired(value),
  thresholdTr: (value) => validateRequired(value),
  isMother: (value) => '',
  isAccess: (value) => ''
}

// partnershipId for option NA
export const partnershipNA = 2;

export const modelStatus = {
  active: 1,
  inactive: 2,
  draft: 3
}

export const measurementStatus = {
  official: 1,
  warrantyPeriod: 2,
  unsubscribe: 3
};

export const typeModel = {
  rum: 1,
  events: 2
}
