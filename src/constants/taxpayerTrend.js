/**
 * Constant to use colors in graphs
 * @type {Object}
 * @constant
 */
export const colors = Object.freeze({
  green: '#48AE64',
  red: '#DA3851',
  blue: '#1464A5',
  grey: '#D9D9D9',
  graph: {
    green: '#48AE64',
    red: '#F35E61',
    blue: '#49A5E6',
    yellow: '#F8CD51',
    pink: '#F59799',
    brightMaroon: '#B92A45',
    maximumBlueGreen: '#2DCCCD',
    mayaBlue: '#5BBEFF',
    greenBlue: '#1973B8',
    oxxfordBlue: '#072146',
    maize: '#F8CD51',
    gambogeOrange: '#9C6C01'
  }
})

/**
 * Constant of goal option
 * @type {Object}
 * @constant
 */
export const goalOption = {
  label: 'Meta',
  color: colors.green,
  order: 0,
  visible: true
}

/**
 * Constant of menu options
 * @type {Object}
 * @constant
 */
export const menuOptions = [
  {
    label: 'Incidencias',
    color: colors.graph.red,
    key: 'incidents',
    subKey: 'total',
    order: 1,
    visible: true,
    width: 400,
    subMenus: [
      {
        label: 'Relevantes',
        color: colors.graph.pink,
        subKey: 'relevants',
        order: 4,
        visible: false
      },
      {
        label: 'No Relevantes',
        color: colors.graph.brightMaroon,
        subKey: 'irrelevants',
        order: 5,
        visible: false
      }
    ]
  },
  {
    label: 'Cambios',
    color: colors.graph.blue,
    key: 'changes',
    subKey: 'total',
    order: 2,
    visible: true,
    width: 650,
    subMenus: [
      {
        label: 'Int.técnicas',
        color: colors.graph.maximumBlueGreen,
        subKey: 'technicalInterventions',
        order: 6,
        visible: false
      },
      {
        label: 'Cambios aplicativos',
        color: colors.graph.mayaBlue,
        subKey: 'applicationChanges',
        order: 7,
        visible: false
      },
      {
        label: 'Incidencia Relevante Origen Cambio',
        color: colors.graph.greenBlue,
        subKey: 'relevantIncidents',
        order: 8,
        visible: false
      },
      {
        label: 'Incidencia No Relevante Origen Cambio',
        color: colors.graph.oxxfordBlue,
        subKey: 'irrelevantIncidents',
        order: 9,
        visible: false
      }
    ]
  },
  {
    label: 'Errores recurrentes',
    color: colors.graph.yellow,
    key: 'errors',
    subKey: 'total',
    order: 3,
    visible: true,
    width: 450,
    subMenus: [
      {
        label: 'Errores de diagnóstico',
        color: colors.graph.maize,
        subKey: 'diagnostics',
        order: 10,
        visible: false
      },
      {
        label: 'Baseline',
        color: colors.graph.gambogeOrange,
        subKey: 'baseLine',
        order: 11,
        visible: false
      }
    ]
  }
]
