import { queryFilter } from "@/utils/requests";
import { pagination } from '@/constants/pagination';
import { instanceAxiosAPI } from "./axiosconfig";


/*
 * This method execute the request to create the first section of a model
 *
 * @param {Object}  data                          All the data to create the first section model
 * @param {Object}  data.data                     Object to fill the information to fill the model
 * @param {Number}  data.data.buId               Business unit's ID
 * @param {Number}  data.data.cfsId              CFS's ID
 * @param {Number}  data.data.serviceOwnerId    Service Owner's ID
 * @param {Number}  data.data.criticalityId       Criticaly's ID
 * @param {Number}  data.data.enviromentId          Evironment's id
 * @param {Boolean} data.data.cfoClp             Flag id cfo or clp is true
 * @param {Number}  data.data.statusId          Status's ID
 * @param {Number}  data.data.measurementStatusId Measurement status's id
 * @param {Number}  data.data.modelTypeId      Model type's ID
 * @param {Number}  data.data.sourceId           Source's id 
 * @param {Number}  data.data.version             Version's model
 * @param {Number}  data.data.availabilityGoal Meta availability of the model
 * @param {Number}  data.data.timeResponseGoal  Meta ime to response
 * @param {Boolean} data.data.serviceLevels       Service level's flag
 * @param {Boolean} data.data.timeResponse     Time to response
 * @param {String}  data.data.dischargeDate          Date to create the model format YYYY-MM-DD
 * @param {String}  data.data.activationDate    Date to activate the model format YYYY-MM-DD
 * @param {String}  data.data.inactivationDate  Date to inactivate the model format YYYY-MM-DD
 * @param {String} data.data.warrantyPeriodDate           Date to start warranty period
 * @param {String} data.data.officialStartDate             Date oficial to start
 * @param {String} data.data.versionStartDate             Date of the start the version model
 * @param {Number} data.data.partnershipId                   Partnership's id
 * @param {Number} data.data.statusMeditionPartnershipId  Measurement partnership's id
 * @param {string} data.data.goalPartnershipExpected        Meta partnership expected
 * @param {Number} data.data.goalPartnershipMinimum         Meta partneship minimum
 * @param {String} data.data.startDatePartnershipInitial Date to start the partnership
 * @param {String} data.data.startDatePartnershipAsIs   Date to start the partnership as ls
 * @param {Object[]}  data.generalWindows                       Array with general windows
 * @param {Number} data.generalWindows[].startDay            Day to start, monday 1 -> sunday 7
 * @param {String} data.generalWindows[].startHour           Hour to start format hh:mm
 * @param {Number} data.generalWindows[].endDay               Day to finish, monday 1 -> sunday 7
 * @param {String} data.generalWindows[].endHour              Hour to finish format hh:mm
 * @param {Boolean} data.generalWindows[].holidays         Flag if it's non working day
 *
 * @return Promise
 */
export const modelCreateFirstSectionAPI = (data) => {
  return instanceAxiosAPI.post('/v1/model/add', data );
};

/*
 * This method execute the request to create the second section of a model
 *
 * @param {Object}   data                                   All the data of the second section model
 * @param {Number}   modelId                              Model's ID
 * @param {Object[]} cbps                                   Array of cbps
 * @param {String}   cbps[].name                          CBP's name
 * @param {Number}   cbps[].number                          CBP's number
 * @param {Object[]} cbps[].operatives                      Array of operatives of the CBP
 * @param {String}   cbps[].operatives[].name                    Operative's name
 * @param {Object}   cbps[].operatives[].urls[].name             Operative's name
 * @param {string}   cbps[].operatives[].urls[].variableElement  Variable element
 * @param {Number}   cbps[].operatives[].urls[].thresholdTr          Umbral TR
 * @param {Boolean}  cbps[].operatives[].urls[].isMother           Flag, true if it's mother
 *
 * @return Promise
 */
export const modelCreateSecondSectionAPI = (data) => {
  return instanceAxiosAPI.post('/v1/model/cbp/add', data );
};

/*
 * This method execute the request to update the second section of a model
 *
 * @param {Object}   data                                   All the data of the second section model
 * @param {Number}   modelId                              Model's ID
 * @param {Object[]} cbps                                   Array of cbps
 * @param {Numner}   cbps[].id                              CBP's ID if it exists
 * @param {String}   cbps[].name                          CBP's name
 * @param {Number}   cbps[].number                          CBP's number
 * @param {Object[]} cbps[].operatives                      Array of operatives of the CBP
 * @param {Number}   cbps[].operatives.id                   Operative's id if it exists
 * @param {String}   cbps[].operatives[].name                   Operative's name
 * @param {Object[]} cbps[].operatives[].url                      Array of opertive's urls
 * @param {string}   cbps[].operatives[].url[].variableElement  Variable element
 * @param {Number}   cbps[].operatives[].url[].thresholdTr          Umbral TR
 * @param {Boolean}  cbps[].operatives[].url[].isMother           Flag, true if it's mother
 *
 * @return Promise
 */
export const modelUpdateSecondSectionAPI = (data) => {
  return instanceAxiosAPI.patch(`v1/model/cbp/update`, data);
};


/*
 * This method execute the request to create the first section of a model
 *
 * @param {Object}  data                          All the data to create the first section model
 * @param {Object}  data.data                     Object to fill the information to fill the model
 * @param {Number}  data.data.buId               Business unit's ID
 * @param {Number}  data.data.cfsId              CFS's ID
 * @param {Number}  data.data.serviceOwnerId    Service Owner's ID
 * @param {Number}  data.data.criticalityId       Criticaly's ID
 * @param {Number}  data.data.enviromentId          Evironment's id
 * @param {Boolean} data.data.cfoClp             Flag id cfo or clp is true
 * @param {Number}  data.data.statusId          Status's ID
 * @param {Number}  data.data.measurementStatusId Measurement status's id
 * @param {Number}  data.data.modelTypeId      Model type's ID
 * @param {Number}  data.data.sourceId           Source's id 
 * @param {Number}  data.data.version             Version's model
 * @param {Number}  data.data.availabilityGoal Meta availability of the model
 * @param {Number}  data.data.timeResponseGoal  Meta ime to response
 * @param {Boolean} data.data.serviceLevels       Service level's flag
 * @param {Boolean} data.data.timeResponse     Time to response
 * @param {String}  data.data.dischargeDate          Date to create the model format YYYY-MM-DD
 * @param {String}  data.data.activationDate    Date to activate the model format YYYY-MM-DD
 * @param {String}  data.data.inactivationDate  Date to inactivate the model format YYYY-MM-DD
 * @param {String} data.data.warrantyPeriodDate           Date to start warranty period
 * @param {String} data.data.officialStartDate             Date oficial to start
 * @param {String} data.data.versionStartDate             Date of the start the version model
 * @param {Number} data.data.partnershipId                   Partnership's id
 * @param {Number} data.data.statusMeditionPartnershipId  Measurement partnership's id
 * @param {string} data.data.goalPartnershipExpected        Meta partnership expected
 * @param {Number} data.data.goalPartnershipMinimum         Meta partneship minimum
 * @param {String} data.data.startDatePartnershipInitial Date to start the partnership
 * @param {String} data.data.startDatePartnershipAsIs   Date to start the partnership as ls
 * @param {Object[]}  data.generalWindows                      Array with general windows
 * @param {Object[]}  data.generalWindows[].id                 window's id if it exists
 * @param {Number} data.generalWindows[].startDay            Day to start, monday 1 -> sunday 7
 * @param {String} data.generalWindows[].startHour           Hour to start format hh:mm
 * @param {Number} data.generalWindows[].endDay               Day to finish, monday 1 -> sunday 7
 * @param {String} data.generalWindows[].endHour              Hour to finish format hh:mm
 * @param {Boolean} data.generalWindows[].holidays         Flag if it's non working day
 *
 * @return Promise
 */
export const modelUpdateFirstSectionAPI = (id, data) => {
  return instanceAxiosAPI.patch(`/v1/model/${id}`, data );
};

/*
 * This function get a model
 *
 * @param {Number} id   Model's id
 *
 * @return Promise
 */
export const getModelAPI = (id) => {
  return instanceAxiosAPI.get(`/v1/model/${id}`);
};

/*
 * This function get many models
 *
 * @param {Number}    pageNumber     Page's number
 * @param {pageSize}  pageSize       Page's size
 * @param {Object[]}  filters           Filter to send into the request
 * @param {String}    filters[].name    Name of the filter
 * @param {String}    filters[].value   Value of the filter, the type can be different
 *
 * @return Promise
 */
export const getModelsAPI = (
  pageNumber = pagination.number,
  pageSize = pagination.size,
  filters = []
) => {
  const query = queryFilter(filters, pageSize, pageNumber);

  return instanceAxiosAPI.post('/v1/model/list', query);

};

/*
 * This function remove a model's window
 *
 * @param {Number} id   Window's id
 *
 * @return Promise
 */
export const removeWindowAPI = (id) => {
  return instanceAxiosAPI.delete(`/v1/model/delete/ventana/${id}`);
};

/*
 * This function remove a model's CBP
 *
 * @param {Number} id   CBP's id
 *
 * @return Promise
 */
export const removeCbpAPI = (id) => {
  return instanceAxiosAPI.delete(`/v1/model/delete/cbp/${id}`);
};

/*
 * This function remove an operarive
 *
 * @param {Number} id   Operative's id
 *
 * @return Promise
 */
export const removeOperativeAPI = (id) => {
  return instanceAxiosAPI.delete(`/v1/model/delete/operative/${id}`);
};

/*
 * This function remove an operatives's url
 *
 * @param {Number} id  URL's id
 *
 * @return Promise
 */
export const removeUrlAPI = (id) => {
  return instanceAxiosAPI.delete(`/v1/model/delete/url/${id}`);
};

/*
 * This function get a model's file
 *
 * @param {Number} id  Model's id
 *
 * @return Promise
 */
export const getExcelFileModel = (id) => {
  return instanceAxiosAPI.get(
    `/v1/model/export/excel/${id}`,
    {
      responseType: 'blob'
    }
  );
};
