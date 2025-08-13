<template>
  <app-bar></app-bar>
  <v-container fluid class="pl-12">
    <v-row justify="space-between" >
      <v-col>
        <div class="d-flex pt-8">
          <img src="/icons/impactByCategory.svg" alt="Icono de la sección"/>
          <span class="pl-1 fs-18 fw-500 pt-2">
            Distribución de impactos por Categoría
          </span>
          <bbva-web-link
            class="primary fw-500 pl-3 pt-1"
            icon="bbva:download"
            @click="download"
          >
          Descargar
          </bbva-web-link>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <filter-impact-by-category :search="searchFilter" :values="filters"/>
      </v-col>
     </v-row>
    <v-row>
      <v-col class="d-flex">
        <span class="fs-14 fw-500 pr-3">
          Rangos de resultados:
        </span>
        <div class="box-color blue" />
        <span class="pl-2 pr-3 fs-14">
          Excelente
        </span>
        <div class="box-color green" />
        <span class="pl-2 pr-3 fs-14">
          Bueno
        </span>
        <div class="box-color yellow" />
        <span class="pl-2 pr-3 fs-14">
          Alerta
        </span>
        <div class="box-color red" />
        <span class="pl-2 pr-3 fs-14">
          Crítico
        </span>
      </v-col>
     </v-row>
    <v-row v-if="!items.length">
      <v-container class="ml-0">
        <v-row>
          <v-col>
            <img src="/icons/searchPaper.svg" alt="icono"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="text-h5">Busqueda de impactos por categoría</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>
              {{
                 !filters.length ? 'Para poder visualizar los datos debes agregar los tres datos, BUs, Criticidad y Fecha' :
              'No hay datos con los filtros seleccionados'
              }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th>
                <bbva-web-table-body-action
                  class="icon-button"
                  @click="switchExpandAll"
                  :icon="expandAll ? 'bbva:collapse' : 'bbva:expand'"
                  size="m"
                  ></bbva-web-table-body-action>
              </th>
              <th>
                <bbva-web-table-header-text>Categoría</bbva-web-table-header-text>
              </th>
              <th
                v-for="(header, index) in headers"
                 style="min-width: 100px;"
                :id="`table-header${index}`"
                :key="`table-header${index}`"
                >
                <bbva-web-table-header-text>{{header}}</bbva-web-table-header-text>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, indexRow) in items"
              :key="`tr-body-${indexRow}`"
              :hidden="row.hidden"
              :style="row.category ? 'background-color: #F4F4F4' : ''"
              >
              <td>
                <bbva-web-table-body-action
                  v-if="row.category && indexRow !== 0"
                  class="icon-button"
                  @click="() => switchExpandRow(indexRow, row.id)"
                  :icon=" rowsOpened.includes(row.id) ? 'bbva:collapse' : 'bbva:expand'"
                  size="m"
                  ></bbva-web-table-body-action>
              </td>
              <td>
                {{ row.name }}
              </td>
              <td
                v-for="(col, indexCol) in row.items"
                :key="`td-${indexRow}-${indexCol}`"
                :class="indexRow === 0 ? 'border-white' : ''"
                :style="indexRow === 0 ? `background: ${col.color};min-width: 130px: display: flex;` : ''"
                :id="`table-col-${indexRow}-${indexCol}`">
                <span
                  :style="
                  indexRow === 0 && col.color !== '#F8CD51'?
                    'color: white;padding-top: 15px; float: left; width: 80%;' :
                    ';padding-top: 15px; float: left; width: 80%;'
                  "
                  >
                  {{ col.value }}
                </span>
                <bbva-web-table-body-action
                  v-if="indexRow === 0"
                  style="float: right; width: 20%;"
                  class="fc-white"
                  @click="() => watchItem(col.cfsId)"
                  icon="bbva:show"
                  size="m"
                  ></bbva-web-table-body-action>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row >
  </v-container>
</template>
<script>
// Requests
import {
  getAvailabilityByPeriodAPI,
  getImpactsByCategoryAPI,
  getImpactsBySubcategoryAPI,
  getExcelImpactsByCategoryAPI
} from '@/requests/impactByCategory.js';
// Components
import AppBar from "@/components/AppBar/AppBar.vue";
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import FilterImpactByCategory from "@/components/table/FilterImpactByCategory.vue"

export default {
  data() {
    return {
      /* Filters set to get the data table*/
      filters: [],
      /* Data to be showed into the table*/
      items: [],
      /* Flag, true if al row must be expanded */
      expandAll: false,
      /* It has the ids of all the rows opened */
      rowsOpened: [],
    };
  },
  computed: {
    /*
     * It returns the headers of the cfses
     */
    headers() {
      if ( this.items.length === 0 ) {
        return [];
      }
      return this.items[0].items.map( (item) => item.name );
    },
    /*
     * It returns the years to be showed into the filter year
     */
    years() {
      const data = [];
      const year = (new Date()).getFullYear();

       for( let i = year; i >= year - 20; i-- ) {
         data.push({ label: i, id: i });
       }
       return data;
    }
  },
  components: {
    AppBar,
    FilterImpactByCategory
  },
  beforeMount() {
    this.setFilters();
  },
  methods: {
    /*
     * This method sets the initial filters
     */
    setFilters() {
      if( !this.$route.query.back ) {
        localStorage.clear();
        return;
      }
      const storage = localStorage.getItem('impacts-by-category');
      const storageFilters = storage ? JSON.parse( storage ) : {};
      if( Object.keys(storageFilters).length === 0 ) {
        return;
      }

     this.filters = storageFilters.values;
     if( this.filters.length ) {
       this.search(this.filters);
     }
    },
    /*
     * Set into local storage the parameters for the filters
     */
    setStorageFilters() {
      localStorage.setItem(
        'impacts-by-category',
        JSON.stringify(
          {
            values: this.filters,
          }
        )
      );
    },

    /*
     * It redirects to watch the item selected
     */
    watchItem(cfsId) {
      let query = `cfsId=${cfsId}`;
      this.filters.forEach( (filter) => {
        if('months' === filter.name) {
          const months = filter.value.sort();

          query += '&month=' + months[ months.length - 1 ];
          return;
        }
         query += '&' + filter.name + '=' + filter.value;
      });

      this.$router.push(
        `/impact-tickets/impacts-by-category/taxpayerTrend?${query}`
      );
    },
    /*
     * It switches the data to expand
     */
    switchExpandAll() {
      this.expandAll = !this.expandAll;
      this.rowsOpened = [];
      this.items.forEach( (item) => {
        item.hidden = item.category ? false : !this.expandAll;
        if( this.expandAll && item.category && item.id) {
          this.rowsOpened.push( item.id );
        }
      });
    },
    /*
     * It fills the columns for the cfses for a category or subcategory
     * @param {Object[]} cfses  Array with the main cfses
     * @param {Object[]} items  Arra with ths cfses of any category or subcategory
     * @return Object[]
     */
    makeColumnsCfses(cfses, items) {
      const data = [];
      cfses.forEach( (cfs) => {
        const found = items.find( (item) => item.id === cfs.cfsId );
        if( found ) {
          data.push( found );
        } else {
          data.push( { id: null, value: '-' } );
        }
      });
      return data;
    },
    /*
     * It switches the row to be expanded or closed
     * @param {Number} index   Row's index
     * @param {Number} id      Row's id
     */
    switchExpandRow(index, id) {
      let i = index + 1;
      if( this.rowsOpened.includes(id) ) {
        this.rowsOpened = this.rowsOpened.filter( (item) => item !== id );
      } else {
        this.rowsOpened.push(id);
      }
      while( i < this.items.length && this.items[i].subcategory ) {
        this.items[i].hidden = !this.items[i].hidden;
        i++;
      }
    },
    /*
     * It downloads the excel file
     */
    download() {
      this.emitter.emit("load", { loading: true });
      getExcelImpactsByCategoryAPI( this.filters ).then(
        (response) => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.ms-excel' }
        )
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'distribucuion_de_impactos_por_categoria.xlsx';
        link.click()
        URL.revokeObjectURL(link.href)
        this.emitter.emit("load", { loading: false });
      }).catch((error) => {
        this.emitter.emit("load", { loading: false });
        this.emitter.emit('error', { action: 'descargar archivo',  error });
      });
    },
    /*
     * This method create and format the data to be showed into the table
     * @param {Object[]}  availabilityByPeriod  Data availability by period
     * @param {Object}    impactsByCategory     Data impacts by category
     * @param {Object}    impactsBySubcategory  Data impacts by subcategory
     */
    mergeData(availabilityByPeriod, impactsByCategory, impactsBySubcategory) {
      const data = [];
      data.push({
        category: true,
        name: 'Disponibilidad del periodo',
        hidden: false,
        items: availabilityByPeriod,
      });
      impactsByCategory.forEach( (category) => {
        data.push({
          category: true,
          hidden: false,
          id: category.id,
          name: category.name,
          items: this.makeColumnsCfses( availabilityByPeriod, category.cfses)
        })
        impactsBySubcategory.filter(
          (subcategory) => subcategory.categoryId === category.id
        ).forEach(
          (subcategory) => {
            data.push({
              subcategory: true,
              hidden: true,
              id: subcategory.id,
              items: this.makeColumnsCfses( availabilityByPeriod, subcategory.cfses),
              name: subcategory.name
            })
          }
        );
      });

      this.items = data;
    },
    /*
     * This method save the filters used and search the data to be showed into the table
     * @param {Object[]} values Array with objects {name: 'buId' , value: 12 }
     */
    searchFilter(values) {
      this.filters = values;
      this.search(this.filters);
    },
    /*
     * This method searches the data to be showed into the table
     * @param {Object[]} values Array with objects {name: 'buId' , value: 12 }
     */
    search(values) {
      this.emitter.emit("load", { loading: true });
      Promise.all([
        getAvailabilityByPeriodAPI(values),
        getImpactsByCategoryAPI(values)
      ]).then( (responses) => {

        this.setStorageFilters();
        const availabilityByPeriod = responses[0].data.items;
        const impactsByCategory = responses[1].data.items;
        if( availabilityByPeriod.length === 0 ) {
          this.items = [];
          this.emitter.emit("load", { loading: false });
          return;
        }
        Promise.all(
          impactsByCategory.map( (item) => (
            getImpactsBySubcategoryAPI([...values, {name: 'categoryId', value: item.id }])
          ))
        ).then( (values) => {
          let impactsBySubcategory = [];
          impactsByCategory.forEach( (category, index) => {
            impactsBySubcategory = [
              ...impactsBySubcategory,
              ...values[index].data.items.map( (item) => ({...item, categoryId: category.id }) )
            ];
          });
          this.mergeData(
            availabilityByPeriod,
            impactsByCategory,
            impactsBySubcategory
          )
          this.expandAll = false;
          this.rowsOpened = [];
          this.emitter.emit("load", { loading: false });
        });
      }).catch((error) => {
        this.emitter.emit('error', { action: 'cargar tabla',  error });
        this.emitter.emit("load", { loading: false });
      });
    }
  }
};

</script>

<style>
.icon-button {
  width: 40px;
  color: #1464A5;
}
.border-white {
  border: white solid 1px;
}
</style>
