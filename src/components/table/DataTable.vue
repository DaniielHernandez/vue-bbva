<template>
  <filter-table :filters="filters.options" :search="searchFilter" v-if="filters.options.length"/>
  <no-data-message
     v-if="!loading && !Object.keys(data).length"
     title="Información de la tabla"
     :message="filters.values.length ? 'No hay datos para los filtros seleccionados' :
              'No hay datos que mostrar en la tabla'"
  />
  <v-container v-else fluid class="pl-12">
    <v-row>
      <v-col>
        <v-table :class="styles.table">
          <thead>
            <tr>
              <th v-if="hiddenDataKeys.length">
              </th>
              <th id="header-checkbox" v-if="noDestroyMany ? false : destroy">
                <bbva-web-table-header-checkbox @change="checkedItems">
                </bbva-web-table-header-checkbox>
              </th>
              <th
                v-for="(header, index) in headers"
                :id="`table-header${index}`"
                :key="`table-header${index}`"
                >
                <bbva-web-table-header-text>{{header.title}}</bbva-web-table-header-text>
              </th>
              <th class="text-right" id="checked-header" v-if="actions">
                <bbva-web-table-body-action
                  v-if="checkedAll || countCheckedItems()"
                  :class="styles.iconButton"
                  @click="onDestroyAll"
                  icon="bbva:trash" size="m"
                  ></bbva-web-table-body-action>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(id, indexRow) in Object.keys(data).sort((a,b) => parseInt( a.match(/\d*/)[0] ) - parseInt( b.match(/\d*/)[0] ) )"
              :key="`tr-body-${indexRow}`"
              :style="`hidden: !${openRows[id]};`"
              >

              <td v-if="hiddenDataKeys.length && !id.includes('hidden')">
                <bbva-button-default
                  variant="link"
                  class="primary"
                  :icon="getIconRowOpen(id)"
                  text=""
                  @click="() => switchRowOpen(id)">
                </bbva-button-default>
              </td>

              <td v-if="openRows[id]" :colspan="getTotalCols()" >
                <v-container fluid class="open-row-table" >
                  <v-row>
                    <v-col>
                      <span class="fs-15 fw-500">{{ titleHiddenRow }}</span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      v-for="col in this.data[id]"
                      class="d-flex"
                      >
                      <img src="/icons/flag.svg" alt="Icono de listado"/>
                      <span class="pl-1 fs-15">
                        {{ hiddenHeaders[col.name] }}: {{ col.value }}
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </td>

              <td
                v-if="noDestroyMany || id.includes('hidden') ? false : destroy"
                :id="`checkbox-table-row-${indexRow}`">
                <bbva-web-table-body-checkbox
                  :checked="checked[id] || checkedAll"
                  @change="(ev) => checked[id] = ev.target.checked"
                  ></bbva-web-table-body-checkbox>
              </td>

              <td
                v-if="!id.includes('hidden')"
                v-for="(col, indexColumn) in data[id]" :key="`td-body-${indexColumn}`">
                <div
                  v-if="(typeof col.value === 'string') && col.value.includes(separator)"
                  class="text-column">
                  {{ splitColumnValue(col.value, 0) }}
                  <br/>
                  <span :class="styles.secondColumn">
                  {{ splitColumnValue(col.value, 1) }}
                  </span>
                </div>
                <div
                  v-else
                  v-html="$sanitize( formatValue(col.name, col.value) )"  class="text-column"/>
              </td>

              <td
                v-if="actions && !id.includes('hidden')"
                class="text-right"
                :style="`min-width: ${actionMinWith}px;`"
                >
                <tooltip-data-table
                  v-if="small"
                  :onEdit="editItem"
                  :onDelete="destroyItem"
                  :onStar="(id) => onStar( id, !isActive(id), findItem(id) )"
                  :onWatch="onWatch"
                  :typeId="id"
                  :edit="edit"
                  :destroy="destroy"
                  :star="star"
                  :watch="watch"
                  />
                <bbva-web-table-body-action
                  v-if="edit && !small"
                  @click="() => editItem(id)"
                  :class="styles.iconButton"
                  icon="bbva:edit" size="m"
                  ></bbva-web-table-body-action>
                <bbva-web-table-body-action
                  v-if="watch && !small"
                  :class="styles.iconButton"
                  @click="() => onWatch(id)"
                  icon="bbva:show" size="m"
                  ></bbva-web-table-body-action>
                <bbva-web-table-body-action
                  v-if="destroy && !small"
                  :class="styles.iconButton"
                  @click="() => destroyItem(id)"
                  icon="bbva:trash" size="m"
                  ></bbva-web-table-body-action>
                <bbva-web-table-body-action
                  v-if="star && !small"
                  :class=" isActive(id) ? styles.buttonActive : styles.iconButton"
                  @click="() => onStar( id, !isActive(id), findItem(id) )"
                  icon="bbva:favorite" size="m"
                  ></bbva-web-table-body-action>
              </td>

            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row >
    <v-row justify="center">
      <v-col sm="4" md="4" lg="3">
        <bbva-web-table-footer
           v-if="total > items.length"
           @click="loadMore"
           class="load-more"
          :loading="loading" loading-text="Cargando">Ver más</bbva-web-table-footer>
        <span v-else :class="styles.secondColumn">no hay más registros por mostrar</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import '@/components/bbva-web-components/bbva-foundations-microillustrations.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import '@/components/bbva-web-components/bbva-web-table-header.js'
import '@/components/bbva-web-components/bbva-web-table-body.js'
import '@/components/bbva-web-components/bbva-web-table-footer.js'
import TooltipDataTable from '@/components/tooltips/TooltipDataTable.vue';
import { separator } from '@/constants/general';
import FilterTable from "@/components/table/FilterTable.vue"
import { pagination } from '@/constants/pagination';
import Loader from '@/components/loaders/ContentLoader.vue'
import NoDataMessage from '@/components/utils/NoDataMessage.vue'
import { parseCatalog } from '@/utils/form';
import { buildData } from '@/utils/table';

/*
 * This component show a table, it can have different actions and those depends on the properties
 */
export default {
  props: {
    /* It contains the field's names */
    requestDataKeys: { type: Array, default: []},
    /* It contains the field's names when the table has hidden fields on the row */
    hiddenDataKeys: { type: Array, default: []},
    /* It contain the hidden headers when the table has hidden fields */
    hiddenHeaders: { type: Object, default: {}},
    /* Function when you need to have a custom build data to show the data for the table */
    customBuildData: { type: Function, default: null},
    /* Object with the fields that has a custom formar to be presented, example
     * { percentage: (value) => (`${value}%`) }
     */
    formatColumns: { type: Object, default: {} },
    /* It hanldles when an user tries to delete many item */
    requestDestroyMany: { type: Function, default: () => ([])},
    /* Flag, true if it must show the column with the icon delete/trash */
    deleteColumn: { type: Boolean, default: true },
    /* Flag, true if it must has the action destroy item*/
    destroy: { type: Boolean, default: true },
    /* Flag, false when it mustn't show the action destroy many items*/
    noDestroyMany: { type: Boolean, default: false },
    /* Flag, true if it must has the action edit item */
    edit: { type: Boolean, default: true },
    /* It has the filters to used to filter the table, example
     * [ {name: 'name', type: 'text '} ]
     */
    filtersOptions: { type: Function, default: () => []},
    /* It has the headers to be showed by the table */
    headers: { type: Function, default: () => [] },
    /* It has he function to handle the action destroy an item */
    onDestroy: { type: Function, default: () => {} },
    /* It handles the action edit the item*/
    onEdit: { type: Function, default: () => {} },
    /* It handles the action watch an item */
    onWatch: { type: Function, default: () => {}, },
    /* It handles the action to star an item */
    onStar: { type: Function, default: () => {} },
    /* It handles the error on any request */
    requestError: { type: Function, default: () => {} },
    /* Flag, true if it must has the option star an item */
    star: { type: Boolean, default: false },
    /* Request data*/
    requestData: { type: Function, deafult: () => {} },
    /* Flag, true if it must show the action watch an item */
    watch: { type: Boolean, default: false },
    /* Flag, */
    titleHiddenRow: { type: String, default: '' },
    /* Flag, it is used to see if the table needs to reload the data */
    refresh: { type: Number, default: 0 }
  },
  data: () => ({
    /* Flag, true if the windonw's size is too small */
    small: false,
    /* Flag, true if the action must be showed */
    actions: { type: Boolean, default: true },
    /* Separator used to split the value for a row*/
    separator,
    /* table's data */
    data: {},
    /* It has the data when the table has hidden data between the rows*/
    openRows: {},
    /* It has the items checked */
    checked: {},
    /* Flag, tre it all the item are checked */
    checkedAll: false,
    /* Flag it is loading something */
    loading: false,
    /* It has the data of the pagination */
    page: {...pagination},
    /* It has the filter of the table */
    filters: { values: [], options: []},
    /* Total of data, value count return by getting the data in request */
    total: 0,
    /* It has original data gotten by the request*/
    items: [],
    /* Styles used*/
    styles: {
      table: ref('data-table'),
      iconButton: ref('icon-button'),
      secondColumn:  ref('second-column'),
      buttonActive: ref('button-active')
    }
  }),
  components: {
    FilterTable,
    NoDataMessage,
    TooltipDataTable,
    Loader
  },
  beforeMount() {
    this.clearCheckedItems();
    this.filters.options = this.filtersOptions;
    this.searchData();
    this.loadCatalogs();
    this.actions = this.edit || this.destroy || this.star
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  computed: {
    actionMinWith() {
      return (
        (this.edit ? 1 : 0) + (this.watch ? 1 : 0) + 
        (this.destroy ? 1 : 0) + (this.star ? 1 : 0)
      ) * 80;

    }
  },
  methods: {
    /* 
     * Get the total columns to be showed by the table
     */
    getTotalCols() {
      const cols = this.requestDataKeys.length +
        (this.actions ? 1 : 0) +
        (this.destroy ? 1 : 0) +
        (this.hiddenDataKeys.length ? 1 : 0);
      return cols;
    },
    /* 
     * It sets the kind of load to show
     */
    setLoad(load, type) {
      if(type === 'more') {
        this.loading = load;
      } else {
        this.emitter.emit("load", { loading: load });
      }
    },
    transformData(data) {
      return data.map(item => ({
        ...item,
        active: item.status === 1
      }));
    },
    /*
     * It searches the data to be showed by the table
     * @param {Number}    pageNumber Page number
     * @param {Number}    pageSize   Page size
     * @param {Object[]}  filters    Table's Filters
     * @param {Boolean}   loading    Type of loading, it can be all or more
     */
    searchData(pageNumber = 1, pageSize = pagination.size, filters = [], loadingType = 'all') {
      this.setLoad(true, loadingType);
      this.requestData(pageNumber, pageSize, filters).then( (response) => {
        this.data = this.customBuildData ?
          this.customBuildData(response.data, this.requestDataKeys, this.hiddenDataKeys) :
          buildData(response.data, this.requestDataKeys);
        this.items = response.data.items || this.transformData(response.data);
        this.total = response.data.count;
        this.setLoad(false, loadingType);
      }).catch((error) =>  {
        this.setLoad(false, loadingType);
        this.requestError('obtener elementos de la tabla.', error);
      });
    },
    /*
     * It splits and string by a separator and return the item with the index
     * @param {Object} value  String to be splited
     * @param {Number} index  Number of index
     * @return {String}
     */
    splitColumnValue(value, index) {
      const splitValue = value.split(separator)[index];
      return splitValue;
    },
    /*
     * It finds an item by id
     * @param {Number} id  Item's id
     * @return {Object} Item founded
     */
    findItem(id) {
      const idString = `${id}`;
      return this.items.find( (item) => `${item.id}` === idString);
    },
    /*
     * It formats the value tp be show into a column
     * @return {String} 
     */
    formatValue(key, value) {
      if( this.formatColumns[key] ) {
        return this.formatColumns[key](value);
      }
      return value;
    },
    /*
     * It edits an item
     * @param {Number} id  Item's id
     */
    editItem(id) {
      this.onEdit( this.findItem(id) );
    },
    /*
     * It tries to destroy an item
     */
    destroyItem(id) {
      this.onDestroy( this.findItem(id) );
    },
    /*
     * It loads the catalogs to be used
     */
    loadCatalogs() {
      this.filters.options.forEach(({request, name}, index) => {
        if( !request ) return;

        request(1, 2000).then( (response) => {
          this.filters.options[index].options = parseCatalog(response.data);
        }).catch((error) => {
          this.requestError('cargar catálogos de', error);
        });
      })
    },
    /*
     * It gets the icon to be showed by th row when it can be expanded
     * @param {Number} id  Item's id
     */
    getIconRowOpen(id) {
      const key = `${id}-hidden`;
      return this.openRows[key] ? 'bbva:fold' : 'bbva:unfold';
    },
    /*
     * It expands a row
     * @param {Number} id  Item's id
     */
    switchRowOpen(id) {
      const key = `${id}-hidden`;
      if( this.openRows[key] ) {
        delete this.openRows[key];
      } else {
        this.openRows[key] = true;
      }
    },
    /*
     * It counts how many items are checked
     */
    countCheckedItems() {
      let count = 0;
      Object.keys(this.checked).forEach( (id) => {
        if( this.checked[id] ) count++;
      });
      return count;
    },
    /*
     * It clears the checked items 
     */
    clearCheckedItems() {
      Object.keys(this.data).forEach((id) => {
        this.checked[id] = false;
      });
    },
    /*
     * It checks in true or false many items
     */
    checkedItems({ target: { checked: value } }) {
      if(!value) {
        this.checked = {};
      }
      this.checkedAll = value;
    },
    /*
     * It handles when the user try to destroy many items at the same time
     */
    onDestroyAll(){
      const ids = []
      if(this.checkedAll) {
        Object.keys(this.data).forEach( (id) => {
          ids.push( id )
        });
      } else {
        Object.keys(this.checked).forEach( (id) => {
          if( this.checked[id] ) {
            ids.push( id )
          }
        });
      }
      this.requestDestroyMany(ids);
    },
    /*
     * It sets the flag when the window's width is too small
     */
    onResize() {
      const width = window.innerWidth;
      this.small =  width <= 1400;
    },
    /*
     * It searches if an item is active
     * @param {Number} id  Item's id
     */
    isActive(id) {
      const item = this.items.find( (element) => `${element.id}` === `${id}` );

      return item.active;
    },
    /*
     * It search the data given the filters
     * @param {Object[]} values Filters's values
     */
    searchFilter(values){
      this.filters.values = values;
      this.page.size = pagination.size;
      this.searchData(1, this.page.size, this.filters.values, 'all');
    },
    /*
     * It loads more data to be showed by the table
     */
    loadMore() {
      this.page.size += pagination.loadMore;
      this.searchData(1, this.page.size, this.filters.values, 'more');
    },
  },
  watch: {
    data(value) {
      const add = Object.keys(value).length - Object.keys(this.checked).length;
      if(add < 0) {
        Object.keys(this.data).forEach((id) => {
          this.checked[id] = !!this.checked[id];
        });
      } else {
        this.clearCheckedItems();
      }
    },
    refresh(value) {
      this.searchData(1, this.page.size, this.filters.values, 'all');
    }
  }
}
</script>

<style>
.data-table {
  border-bottom: 1px solid #D3D3D3;
}
.icon-button {
  width: 40px;
  color: #1464A5;
}
.icon-button:hover {
  color: #072146;
}
.second-column {
  color: #666666;
  font-size: 12px;
  font-weight: 350 !important;
}
.button-active {
  width: 40px;
  color: #8E7022;
}
.text-column {
  font-size: 14px !important;
}
.load-more {
  font-size: 15px;
  font-weight: 500;
}
.open-row-table {
  height: 146px;
}
</style>

