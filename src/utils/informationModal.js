/*
 * It capitalize the first letter of the string given
 * @param {String} resource  String to capiltalize the first letter
 *
 * @return {String}
 */
const capitalizeFirstLetter = (resource) => (
  resource.charAt(0).toUpperCase() + resource.slice(1)
);

/*
 * It return an object with  the keys t show a modal with a message
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const editSuccessModal = (resource) => ({
  type: 'success',
  message: `Has editado el ${resource} correctamente`,
  title: `${capitalizeFirstLetter(resource)} Editado`
});

/*
 * It return an object with  the keys t show a modal with a message success when creates a modal
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const createSuccessModal = (resource) => ({
  type: 'success',
  title: `${capitalizeFirstLetter(resource)} creado`,
  message: `Has creado el ${resource} correctamente`
});

/*
 * It return an object with  the keys t show a modal with a message remove an item
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const removeCautionModal = (resource) => ({
  type: 'caution',
  title: `¿Seguro que quieres eliminar el ${resource}?`,
  message: `El elemento borrará de manera permanente`
});

/*
 * It return an object with  the keys t show a modal with a message remove many items
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const removeManyCautionModal = (resource) => ({
  type: 'caution',
  title: `¿Seguro que quieres eliminar ${resource}?`,
  message: `Los elementos se borrarán de manera permanente`
});

/*
 * It return an object with  the keys t show a modal with a message star an item
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const starSuccessModal = (resource) => ({
  type: 'success',
  title: `${capitalizeFirstLetter(resource)} activado`,
  message: `Has activado el ${resource} correctamente`
});

/*
 * It return an object with  the keys t show a modal with a message unstar an item
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const unstarSuccessModal = (resource) => ({
  type: 'success',
  title: `${capitalizeFirstLetter(resource)} desactivado`,
  message: `Has desactivado el ${resource} correctamente`
});

/*
 * It return an object with  the keys t show a modal with a message success when remove an item
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const removeSuccessModal = (resource) => ({
  type: 'success',
  title: `${capitalizeFirstLetter(resource)} eliminado`,
  message: `Has eliminado el ${resource} correctamente`
});

/*
 * It return an object with  the keys t show a modal with a message error
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const errorRequestModal = (action, error) => {
  const message = error?.response?.data?.detail || error?.response?.data?.message || 'Ocurrio un error, vuleve a intentar';
  return {
    type: 'caution',
    title: `Error al ${action}`,
    message: message
  }
};

/*
 * It return an object with  the keys t show a modal with a message
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const saveTempSuccessModal = () => ({
  type: 'success',
  title: 'Modelo guardado',
  message: `Has guardado el Modelo temporalmente`
});

/*
 * It return an object with  the keys t show a modal with a message
 * @param {String} resource  It has the resource's name
 *
 * @return Object
 */
export const saveSuccessModal = () => ({
  type: 'success',
  title: 'Modelo guardado',
  message: `Has creado el Modelo correctamente`
});
