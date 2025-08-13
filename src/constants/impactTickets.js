export const optionsRadioYesNo = [
  { id: 'Si', label: 'Si' },
  { id: 'No', label: 'No' }
]

/**
 * Ticket types
 * @type {Object}
 * @constant
 */
export const ticketTypesIds = Object.freeze({
  INCIDENTS: 1, //INC
  DIAGNOSTIC_ERRORS: 2, //SF
  TECHNICAL_INTERVENTIONS: 3, //CRQ
  BASELINE: 4, //BL
  APPLICATION_CHANGE: 5, // AC
  SET1_REQUIREMENT: 6 //REQ
});

/**
 * Tickets to show
 * @type {Array}
 * @constant
 */
const showAll = [
  ticketTypesIds.INCIDENTS,
  ticketTypesIds.DIAGNOSTIC_ERRORS,
  ticketTypesIds.TECHNICAL_INTERVENTIONS,
  ticketTypesIds.BASELINE,
  ticketTypesIds.APPLICATION_CHANGE,
  ticketTypesIds.SET1_REQUIREMENT
]

/**
 * CFS impact headers
 * @type {Array}
 * @constant
 */
export const cfsImpactHeaders = [
  { title: 'ID CFS', value: 'cfsId', typesShow: [] },
  { title: 'ID ORIGEN', value: 'originId', typesShow: [] },
  { title: 'CFS impactado', value: 'name', typesShow: showAll },
  { title: 'FECHA - HORA', value: 'dateTime', typesShow: showAll },
  { title: 'SÍNTOMA', value: 'symptom', typesShow: [
    ticketTypesIds.INCIDENTS,
    ticketTypesIds.DIAGNOSTIC_ERRORS,
    ticketTypesIds.TECHNICAL_INTERVENTIONS,
    ticketTypesIds.BASELINE,
    ticketTypesIds.APPLICATION_CHANGE
  ] },
  { title: 'COMENTARIO DIAGNÓSTICO', value: 'comments', typesShow: [ticketTypesIds.SET1_REQUIREMENT] },
  {
    title: 'MIN IMPACTO',
    value: 'impactMinutes',
    typesShow: [ticketTypesIds.TECHNICAL_INTERVENTIONS, ticketTypesIds.APPLICATION_CHANGE]
  },
  { title: 'CONTRIBUCIÓN ', value: 'contribution', typesShow: showAll },
  {
    title: 'ORIGEN',
    value: 'origin',
    typesShow: [
      ticketTypesIds.TECHNICAL_INTERVENTIONS,
      ticketTypesIds.APPLICATION_CHANGE,
      ticketTypesIds.SET1_REQUIREMENT
    ]
  },
  {
    title: 'CONTRIB D+1',
    value: 'contributionD',
    typesShow: [ticketTypesIds.INCIDENTS, ticketTypesIds.DIAGNOSTIC_ERRORS, ticketTypesIds.BASELINE],
    typesModalShow: [ticketTypesIds.INCIDENTS, ticketTypesIds.DIAGNOSTIC_ERRORS]
  },
  {
    title: 'CLASIFICACIÓN D+1',
    value: 'clasificationD',
    typesShow: [ticketTypesIds.INCIDENTS, ticketTypesIds.DIAGNOSTIC_ERRORS, ticketTypesIds.BASELINE]
  },
  {
    title: '',
    value: 'actions',
    typesShow: showAll,
    disabledShow: [ticketTypesIds.BASELINE],
    disabledDelete: [ticketTypesIds.BASELINE]
  }
]

/**
 * CFS impact more data headers
 * @type {Array}
 * @constant
 */
export const cfsImpactMoreDataHeaders = [
  {
    title: 'Origen',
    value: 'origin',
    typesShow: [ticketTypesIds.INCIDENTS, ticketTypesIds.BASELINE, ticketTypesIds.DIAGNOSTIC_ERRORS]
  },
  { title: 'Impacto Total', value: 'totalImpact', typesShow: [ticketTypesIds.INCIDENTS] },
  { title: 'Impacto en el Acceso', value: 'accessImpact', typesShow: [ticketTypesIds.INCIDENTS] },
  {
    title: 'Minutos de impacto',
    value: 'impactMinutes',
    typesShow: [ticketTypesIds.INCIDENTS, ticketTypesIds.BASELINE, ticketTypesIds.DIAGNOSTIC_ERRORS]
  }
]

/**
 * CFS impact edit fields
 * @type {Array}
 * @constant
 */
export const cfsImpactEditFields = [
  { title: 'CFS', value: 'name', typesShow: showAll, editable: false },
  {
    title: 'Fecha - Hora Inicio',
    value: 'dateTimeStart',
    typesShow: showAll,
    editable: false
  },
  {
    title: 'Fecha - Hora Fin',
    value: 'dateTimeEnd',
    typesShow: showAll,
    editable: false
  },
  { title: 'Contribución', value: 'contribution', typesShow: showAll, editable: false },
  {
    title: 'Contribución D+1',
    value: 'contributionD',
    typesShow: [
      ticketTypesIds.INCIDENTS,
      ticketTypesIds.DIAGNOSTIC_ERRORS,
      ticketTypesIds.BASELINE,
      ticketTypesIds.APPLICATION_CHANGE
    ],
    editable: false
  },
  {
    title: 'Clasificación D+1',
    value: 'clasificationD',
    typesShow: [
      ticketTypesIds.INCIDENTS,
      ticketTypesIds.DIAGNOSTIC_ERRORS,
      ticketTypesIds.BASELINE,
      ticketTypesIds.APPLICATION_CHANGE
    ],
    editable: false
  },
  {
    title: 'Comentario diagnóstico',
    value: 'symptom',
    typesShow: [ticketTypesIds.SET1_REQUIREMENT],
    editable: false
  },
  { title: 'Minutos de impacto', value: 'impactMinutes', typesShow: showAll, editable: false },
  {
    title: 'Síntoma',
    value: 'symptom',
    typesShow: [
      ticketTypesIds.INCIDENTS,
      ticketTypesIds.DIAGNOSTIC_ERRORS,
      ticketTypesIds.TECHNICAL_INTERVENTIONS,
      ticketTypesIds.BASELINE,
      ticketTypesIds.APPLICATION_CHANGE
    ],
    editable: true
  },
  {
    title: 'Origen',
    value: 'originId',
    typesShow: showAll,
    editable: true
  },
  {
    title: 'Impacto Total',
    value: 'totalImpact',
    typesShow: [ticketTypesIds.INCIDENTS],
    editable: true
  },
  {
    title: 'Impacto en el Acceso',
    value: 'accessImpact',
    typesShow: [ticketTypesIds.INCIDENTS],
    editable: true
  }
]

/*
 * It has the titles and keys for the expanded row depending on the ticket type
 */
/**
 * Tickets expanded rows
 * @type {Object}
 * @constant
 */
export const ticketTypesRowsExpanded = {
 INCIDENTS: [
   { label: 'Causa raíz', key: 'rootCauseINC' },
   { label: 'Causa', key: 'cause' },
   { label: 'Folio problema', key: 'issueTicket' },
   { label: 'Taxonomía', key: 'taxonomy' },
 ],
 DIAGNOSTIC_ERRORS: [],
 TECHNICAL_INTERVENTIONS: [
   { label: 'Causa raíz', key: 'rootCauseCRQ' },
   { label: 'Estado', key: 'status' },
 ],
 BASELINE: [],
 APPLICATION_CHANGE: [
   { label: 'Causa raíz', key: 'rootCauseCRQ' },
   { label: 'Estado', key: 'status' },
 ],
 SET1_REQUIREMENT: [
   { label: 'Fecha fin', key: 'endDateString' },
   { label: 'CRQ/REQ Causante', key: 'crqReqCause' },
   { label: 'Clasificación', key: 'classification' },
   { label: 'Tipología', key: 'typology' },
   { label: 'Operativa(s)', key: 'operative' },
 ]
};

/*
 * It has the values to be showed when open form to edit an impact ticket
 */
/**
 * Impact ticket form rows
 * @type {Object}
 * @constant
 */
export const rowsImpactTicketForm = {
  INCIDENTS: [
    { label: 'Business Unit', key: 'bu' },
    { label: 'Fecha - Hora Inicio', key: 'starTimeString' },
    { label: 'Fecha - Hora Fin', key: 'endDateString' },
    { label: 'Descripción', key: 'description' },
    { label: 'Criticidad', key: 'criticality' },
    { label: 'Classificación D+1', key: 'classificationD1' },
    { label: 'Causa raíz', key: 'rootCauseINC' },
    { label: 'Causa', key: 'cause' },
    { label: 'Folio problema', key: 'issueTicket' },
    { label: 'Taxonomía', key: 'taxonomy' },
  ],
  DIAGNOSTIC_ERRORS: [
    { label: 'Business Unit', key: 'bu' },
    { label: 'Fecha inicio', key: 'starTimeString' },
    { label: 'Fecha fin', key: 'endDateString' },
  ],
  TECHNICAL_INTERVENTIONS: [
    { label: 'Business Unit', key: 'bu' },
    { label: 'Fecha inicio', key: 'starTimeString' },
    { label: 'Descripción', key: 'description' },
    { label: 'Causa raíz', key: 'rootCauseCRQ' },
  ],
  BASELINE: [
    { label: 'Business Unit', key: 'bu' },
    { label: 'Fecha inicio', key: 'starTimeString' },
    { label: 'Fecha fin', key: 'endDateString' },
  ],
  APPLICATION_CHANGE: [],
  SET1_REQUIREMENT: []
};

export const contributionDataHeaders = [
  { title: 'CFS impactado', value: 'name' },
  { title: 'Fecha inicio', value: 'dateTimeStart' },
  { title: 'Fecha fin', value: 'dateTimeEnd' },
  { title: 'Síntomas', value: 'symptom' },
  { title: 'Contribución ', value: 'contribution' },
  { title: 'Contribución D+1', value: 'contributionD' },
  { title: 'Clasificación D+1', value: 'clasificationD' }
]

export const contributionHeaders = [
  { title: 'OPERATIVA', value: 'operative' },
  { title: 'ACTIVIDAD TOTAL DÍA', value: 'totalActivityDay' },
  { title: 'ERRORES', value: 'errors' },
  { title: '% PESO DÍA', value: 'weightDay' },
  { title: '% PESO OPERATIVA', value: 'weightOperative' },
  { title: 'CONTRIB. SIN PONDERAR', value: 'contributionUnweighted' },
  { title: 'CONTRIBUCIÓN', value: 'contribution' }
]

export const operativesCfsImpactHeaders = [
  { title: 'ID OPERATIVA', value: 'operativeId', typesShow: [] },
  { title: 'OPERATIVA', value: 'operative', typesShow: showAll },
  { title: 'FECHA - HORA INICIO', value: 'dateTimeStart', typesShow: showAll },
  { title: 'FECHA - HORA FIN', value: 'dateTimeEnd', typesShow: showAll },
  {
    title: 'MIN IMPACTO',
    value: 'impactMinutes',
    typesShow: [
      ticketTypesIds.INCIDENTS,
      ticketTypesIds.TECHNICAL_INTERVENTIONS,
      ticketTypesIds.APPLICATION_CHANGE,
      ticketTypesIds.SET1_REQUIREMENT
    ]
  },
  { title: '', value: 'actions', typesShow: showAll }
]
