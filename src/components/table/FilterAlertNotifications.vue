<template>
  <v-container fluid class="pl-0" style="position: relative">
    <v-row justify="start">
      <!-- BU -->
      <v-col sm="12" md="6" lg="3">
        <div class="pb-sm-12">
          <bbva-web-form-select
            class="select-multiple"
            @change="(ev) => setValue('buId', ev.target.value)"
            :invalid="!!inputs.buId.error"
            :error-message="inputs.buId.error"
            label="Business Unit"
            :value="inputs.buId.value"
          >
            <bbva-web-form-option
              v-for="option in options.buId"
              :key="option.id"
              :selected="inputs.buId?.value?.includes(option.id) || false"
              :value="`${option.id}`"
            >
              <span class="pl-4">{{ option.name }}</span>
            </bbva-web-form-option>
          </bbva-web-form-select>
        </div>
      </v-col>
      <!-- CFS -->
      <v-col sm="12" md="6" lg="3">
        <div class="pb-sm-12">
          <bbva-web-form-select
            @change="(ev) => setValue('cfsId', ev.target.value)"
            class="select-multiple"
            :invalid="!!inputs.cfsId.error"
            :disabled="!inputs.buId.value"
            :error-message="inputs.cfsId.error"
            label="CFS"
            :value="inputs.cfsId.value"
          >
            <bbva-web-form-option
              v-for="option in options.cfsId"
              :key="option.id"
              :selected="inputs.cfsId?.value?.includes(option.id) || false"
              :value="`${option.id}`"
            >
              <span class="pl-4">{{ option.label }}</span>
            </bbva-web-form-option>
          </bbva-web-form-select>
        </div>
      </v-col>
      <!-- Alert Element -->
      <v-col sm="12" md="6" lg="3">
        <bbva-web-form-select
          @change="(ev) => setValue('elementToAlertId', ev.target.value)"
          :error-message="inputs.elementToAlertId.error"
          :invalid="!!inputs.elementToAlertId.error"
          label="Elemento a alertar"
          :value="inputs.elementToAlertId.value"
        >
          <bbva-web-form-option
            v-for="option in options.elementToAlertId"
            :selected="inputs.elementToAlertId?.value === option.id"
            :key="option.id"
            :value="option.id"
          >
            <span class="pl-4">{{ option.name }}</span>
          </bbva-web-form-option>
        </bbva-web-form-select>
      </v-col>
      <!-- More filters -->
      <v-col v-if="variant === 'unattendedAlerts'" xs="12" sm="6" md="3" lg="2" xl="1">
        <div>
          <bbva-button-default
            text="Ver más filtros"
            class="w-100"
            @click="openMoreFiltersCard"
            style="border: none"
            variant="secondary"
          />
        </div>
      </v-col>
      <!-- Search button (main filters)-->
      <v-col xs="12" sm="6" md="3" lg="1">
        <bbva-button-default
          class="w-100"
          @click="searchFilter"
          text="Buscar"
          v-if="!showMorefilters"
        ></bbva-button-default>
      </v-col>
    </v-row>
    <!-- Unattended Alerts View filters -->
    <v-card
      class="more-filters-card mt-0 ml-xl-0 ml-lg-0"
      v-if="variant === 'unattendedAlerts'"
      v-show="showMorefilters"
    >
      <v-card-text>
        <v-container fluid class="pl-xl-12 pl-lg-12 ml-0 mr-0">
          <v-row>
            <!-- Author -->
            <v-col sm="12">
              <!-- Close icon -->
              <div class="float-right">
                <v-btn variant="text" size="x-small" @click="closeMoreFiltersCard"
                  ><img src="/icons/close.svg" alt="Cerrar"
                /></v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <!-- Author -->
            <v-col sm="12" md="12" lg="6" xl="6">
              <bbva-web-form-select
                @change="(ev) => setValue('authorId', ev.target.value)"
                :error-message="inputs.authorId.error"
                :invalid="!!inputs.authorId.error"
                label="Autor"
                :value="inputs.authorId.value"
              >
                <bbva-web-form-option
                  v-for="option in options.authorId"
                  :selected="inputs.authorId?.value === option.id"
                  :key="option.id"
                  :value="option.id"
                >
                  <span class="pl-4">{{ option.name }}</span>
                </bbva-web-form-option>
              </bbva-web-form-select>
            </v-col>
          </v-row>
          <v-row>
            <!-- Search button (more filters)-->
            <v-col xs="12" sm="2">
              <bbva-button-default text="Buscar" class="w-100" @click="searchFilter" />
            </v-col>
            <!-- Clear filters button -->
            <v-col xs="12" sm="2">
              <bbva-button-default
                text="Borrar filtros"
                class="w-100"
                @click="clearFilters"
                style="border: none"
                variant="secondary"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
// Components
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-web-form-select-multiple.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import { parseCatalog } from '@/utils/form'
// Requests
import { getCfsModelAPI } from '@/requests/cfs'
import { getBusinessUnitsAPI } from '@/requests/businessUnit'
import { getAlertAuthors, getElementsToAlertAPI } from '@/requests/alerts'

export default {
  data() {
    return {
      /**
       * Flag to display the "more filters" floating card
       */
      showMorefilters: false,
      /* It has the inputs with the fields, values and errors,  example
       * { buId: [ value: 3, error: '' ] }
       */
      inputs: {
        authorId: { name: 'authorId', value: null, error: '' },
        buId: { name: 'buId', value: null, error: '' },
        cfsId: { name: 'cfsId', value: null, error: '' },
        elementToAlertId: { name: 'elementToAlertId', value: null, error: '' }
      },
      /* Option to be used by the selects*/
      options: {
        authorId: [],
        buId: [],
        cfsId: [],
        elementToAlertId: []
      },
      /* It has the fiels type select that are nested, example
       *  [ buId: [{ field: 'cfsId', request: getCfsesAPI } ]
       * Following this exmaple if buId change then the catalogs for the
       * cfs is going to be reloaded with the filter buId
       */
      nestedFields: {
        buId: [{ field: 'cfsId', request: getCfsModelAPI }]
      }
    }
  },
  beforeMount() {
    this.loadCatalogs()
  },
  methods: {
    /*
     * This method check if the field has nested fields, only for selects fields
     * example
     * business unit depends of geography
     * @param {String} name   Field's name
     * @param {String} value  Field's value
     */
    applyNestedFields(name, value) {
      if (!this.nestedFields[name]) {
        return
      }
      if (this.nestedFields[name]?.length) {
        const filter = [{ name, value }]
        if (name === 'buId') {
          filter[0].name = 'buIds'
          filter[0].value = [value]
        }

        this.emitter.emit('load', { loading: true })
        this.nestedFields[name].forEach(({ field, request }) => {
          this.inputs[field] = { value: null, error: null }
          request(1, 3000, filter)
            .then((response) => {
              this.options[field] = parseCatalog(response.data)
            })
            .catch((error) => {
              this.emitter.emit('error', { action: 'Cargar catalogos de filtros', error })
            })
            .finally(() => {
              this.emitter.emit('load', { loading: false })
            })
        })
      }
    },
    clearFilters() {
      this.closeMoreFiltersCard()
      Object.keys(this.inputs).forEach((input) => {
        this.setValue(input, null)
      })
    },
    /**
     * Closes the "more filters" dialog
     */
    closeMoreFiltersCard() {
      this.showMorefilters = false
    },
    /*
     * Loads the initial catalogs used by the selects
     */
    async loadCatalogs() {
      this.emitter.emit('load', { loading: true })
      const catalogPromises = [
        getBusinessUnitsAPI(),
        getElementsToAlertAPI(),
        this.variant === 'unattendedAlerts' ? getAlertAuthors() : null
      ]

      await Promise.all(catalogPromises)
        .then((response) => {
          this.options.buId = response[0].data.items
          this.options.elementToAlertId = response[1].data.items
          if (this.variant === 'unattendedAlerts') {
            this.options.authorId = response[2]?.data?.items
          }
        })
        .catch((error) => {
          this.emitter.emit('load', { loading: false })
          this.emitter.emit('error', { action: 'cargar catalogos', error })
        })
    },
    /**
     * Opens the "more filters" dialog only if the component is not the "alertNotifications" variant
     */
    openMoreFiltersCard() {
      if (this.variant !== 'alertNotifications') {
        this.showMorefilters = true
      }
    },
    /*
     * Prepares data to be sent to the search method
     */
    searchFilter() {
      const values = []
      Object.values(this.inputs).forEach((input) => {
        if (input.value) {
          values.push({
            // for this specific case, we need to send modelId instead
            name: input.name === 'cfsId' ? 'modelId' : input.name,
            value: input.value
          })
        }
      })
      if (this.variant === 'unattendedAlerts') {
        this.closeMoreFiltersCard()
      }
      this.search(values)
    },
    /*
     * This method sets the value into a field
     * @param {String} name   Field's name
     * @param {String} value  Field's value
     */
    setValue(name, value) {
      this.inputs[name] = {
        value,
        name
      }
      if (name === 'buId' && value !== null) {
        this.applyNestedFields(name, value)
      }
    }
  },
  props: {
    /*
     * Function to send the filters when the submit the form
     * It send an array with the next formar
     * [
     *  { name: 'buId', value: 2 }
     * ]
     */
    search: {
      type: Function,
      default: () => {}
    },
    /**
     * The type of filtering we're using for different views:
     * alertNotifications, unattendedAlerts
     */
    variant: {
      type: String,
      default: 'alertNotifications'
    }
  }
}
</script>

<style>
.select-multiple {
  height: 0px;
  --_options-z-index: var(--bbva-web-form-select-multiple-options-z-index, 30);
}

.more-filters-card {
  z-index: 50;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
