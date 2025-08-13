<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <bbva-help-tooltip
    class="tooltip-cbp"
    :opened="open"
    horizontalPlacement="left"
    @help-tooltip-overlay-click="close"
  >
    <bbva-web-link
      class="primary padding-invoker"
      slot="invoker"
      icon="bbva:listview"
      @click="show">
      Seleccionar CFS CBP Operativa
    </bbva-web-link>
    <div class="block-tooltip pt-1">
      <span class="fs-18 fc-white fw-500">Selecciona una opción</span>
      <div class="float-right">
        <v-btn
          variant="text"
          size="x-small"
          @click="close"
          >
          <bbva-core-icon icon="bbva:close" size="m"></bbva-core-icon>
        </v-btn>
      </div>
      <bbva-form-input
        type="search"
        ambient="secondary"
        class="pt-4" 
        label="Selecciona CFS CBP u operativa"
        action-variant="no-background"
        @formSearchButtonSubmit="(ev) => search(ev.target.value)"
        @formFieldInputClear="clear"
      ></bbva-form-input>
      <v-virtual-scroll :height="400" :items="[1]">
        <div role="radiogroupcbp">
          <bbva-web-form-radio-button
            ambient="dark"
            v-if="showCfs"
            class="border-bottom-white pt-2 pb-2"
            :checked="checkedCfs"
            @change="checkCfs">
            <span class="fs-15 fc-white">{{cfsName}}</span>
          </bbva-web-form-radio-button>

          <v-container
            fluid
            class="border-bottom-white"
            v-for="(cbp, indexRadio) in radios"
            :key="`radio-tooltip-${indexRadio}-cbp`"
            >
            <v-row>
              <v-col cols="12">
                <bbva-web-form-radio-button
                  ambient="dark"
                  :checked="radio.name === 'cbpId'  && radio.value === cbp.id"
                  @change="() => updateRadio('cbpId', cbp.id)">
                  <span class="fs-15 fc-white">{{cbp.name}}</span>
                </bbva-web-form-radio-button>
              </v-col>
            </v-row>
            <v-row
              class="pl-6"
              :key="`radio-op-${indexRadio}-${opIndex}`"
              v-for="(op, opIndex) in cbp.operatives">
              <v-col cols="12" class="pt-0" >
              <bbva-web-form-radio-button
                ambient="dark"
                :checked="radio.name === 'operativeId' && radio.value === op.id"
                @change="() => updateRadio('operativeId', op.id)">
                <span class="fs-15 fc-white">{{op.name}}</span>
              </bbva-web-form-radio-button>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-virtual-scroll>
    </div>
  </bbva-help-tooltip>
</template>
<script>
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-form-radio-button.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-form-input.js'
import { getCfsAPI } from '@/requests/cfs';

/*
 * This component is a filter with a specific CFS with its cbps and its operatives
 */
export default {
  name: 'CfsTooltip',
  data() {
    return {
      /* Flag, true if the tooltip mus be open*/
      open: false,
      /* It has all current the cbps and its operatives */
      radios: [],
      /* It's the cfs's name*/
      cfsName: '',
      /* Flag, true is the cfs must be showed*/
      showCfs: true,
      /* Flag, true if the option cfs is checked */
      checkedCfs: true,
      /* It has all the originals cbps with its operatives */
      originalRadios: []
    };
  },
  beforeMount() {
    this.loadCfs(this.cfsId);
  },
  mounted() {
    this.initializeRadioCfs();
    new Promise(() => setTimeout(() => {
      document.querySelector('bbva-form-input').shadowRoot.querySelector(
        'bbva-form-search'
      ).setAttribute( 'style' ,
        '--_field-bg-color: var(--bbva-form-field-bg-dark-mode-color, var(--bbva-form-field-bg-color, #004486));' +
        '--_field-input-color: white;' +
        '--_field-label-color: white;' +
        '--_field-border-color: white;' +
        '--_field-focused-label-color: white;' +
        '--bbva-button-default-icon-color-variant: white;'
        )
    }, 2000));
  },
  methods: {
    /*
     * It initializes the radio cfs to true if the variable radio
     * doesn't  has a name, that means that the cfs option must be checked
     */
    initializeRadioCfs() {
      if( !this.radio.name ) {
        this.checkedCfs = true;
      } else {
        this.checkedCfs = false;
      }
    },
    /*
     * This function add the cfs as checked radio
     *
     */
    checkCfs() {
      if( this.checkedCfs ) return;

      this.checkedCfs = true;
      this.setCBP(null);
      this.setFilter({});
    },
    /*
     * This function update the radio checked, CBP or operative
     *
     */
    updateRadio(name, value) {
      if(name === 'operativeId') {
        const cbp = this.findCBP(value);
        this.setCBP(cbp.id);
      } else {
        this.setCBP(value);
      }

      this.checkedCfs = false;
      this.setFilter({name, value});
    },
    /*
     * The method find the CBP fo a specific operative
     *
     * @param {Number} operativeId Operative's ID
     * @return Object CFS found
     *
     */
    findCBP(operativeId) {
      const cbp = this.originalRadios.find( (cbp) => {
        return cbp.operatives.find( (op) => op.id === operativeId );
      });
      return cbp;
    },
    /*
     * This method clear the radios and set cfs as a default choise
     *
     */
    clear() {
      this.showCfs = true;
      this.radios = this.originalRadios;
    },
    /*
     * Filter the radio options
     * @param {String}  value String to filter the radio options
     */
    search(value) {
      const str = value.toLowerCase();

      this.showCfs = this.cfsName.toLowerCase().includes(str);

      this.radios = this.originalRadios.filter((cbp) => {
        if( cbp.name.toLowerCase().includes(str) ) {
          return true;
        }
        return cbp.operatives.find( (op) => op.name.toLowerCase().includes(str) );
      })
    },
    /*
     * This method changes the status open to true
     */
    show() {
      this.open = true;
    },
    /*
     * This method changes the status open to false
     */
    close() {
      this.open = false;
    },
    /*
     * This method execue the request to get CFS with its cbps and operatives
     */
    loadCfs(value) {
      getCfsAPI(value).then((response) => {
        this.radios = response.data.cbps;
        this.cfsName = response.data.name;
        this.originalRadios = response.data.cbps;
        this.$emit('load');
      })
    }
  },
  props: {
    /* Handle the change of radio choosen */
    setFilter: {  type: Function, default: () => {} },
    /* Set the change of the cbp */
    setCBP: {  type: Function, default: () => {} },
    /* Cfs'ID */
    cfsId: {  type: Number, default: null },
    /* radio choosen */
    radio: { type: Object, default: () => {} }
  },
  watch: {
    /*
     * This method follows the change of the cfs
     */
    cfsId(value, oldValue) {
      if(value !== oldValue) {
        this.checkedCfs = true;
        this.loadCfs(value); 
      }
    }
  }
};
</script>

<style>
.tooltip-cbp {
  z-index: 100;
  --_tooltip-width: var(--bbva-help-tooltip-width, 349px);
  --_tooltip-height: var(--bbva-help-tooltip-height, 700px);
  --_help-tooltip-overlay-bg-color: var(, unset);
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_z-index: var(--bbva-help-tooltip-z-index, 100);
  --_help-tooltip-after-bg-color: #004486;
}
.radio-custom-grid {
  padding-top: 20px;
  padding-bottom: 10px;
	display: flex;
	justify-content: space-around;
}

.border-bottom-white {
  border-bottom: 1px solid white;
}

.second-section-radio {
  padding-top: 20px;
  padding-bottom: 20px;
}

.block-tooltip {
  height: 500px;
}
.padding-invoker {
 padding-bottom: 1rem;
}
</style>
