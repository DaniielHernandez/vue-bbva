<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <bbva-help-tooltip
    class="tooltip-impact-ticket"
    :opened="open"
    horizontalPlacement="right"
    @help-tooltip-overlay-click="close"
  >
    <bbva-web-link
      slot="invoker"
      @click="show"
      class="fs-14 fw-500 primary pt-3"
      icon="bbva:configuration" size="s"
      ></bbva-web-link>
    <div style="width: 40px;">
      <bbva-web-link
        v-if="star"
        class="color-text-impact-ticket fw-500"
        icon="bbva:star"
        @click="() => onStar(typeId)">
        Cambiar estatus
      </bbva-web-link>
      <bbva-web-link
        v-if="watch"
        class="color-text-impact-ticket fw-500"
        icon="bbva:show"
        @click="() => onWatch(typeId)">
        Ver
      </bbva-web-link>
      <bbva-web-link
        v-if="edit"
        class="color-text-impact-ticket fw-500"
        icon="bbva:edit"
        @click="() => onEdit(typeId)">
        Editar
      </bbva-web-link>
      <bbva-web-link
          v-if="destroy"
        class="color-text-impact-ticket fw-500"
        icon="bbva:trash"
        @click="() => onDelete(typeId)">
        Eliminar
      </bbva-web-link>
    </div>
  </bbva-help-tooltip>
</template>
<script>
// Components
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'

/*
 * This methos shows the tooltip to choose between availability and decimals
 */
export default {
  data() {
    return {
      /* Flag, true it the tooltip is open */
      open: false
    };
  },
  methods: {
    /*
     * Open the tooltip
     */
    show() {
      this.open = true;
    },
    /*
     * Close the tooltip
     */
    close() {
      this.open = false;
    },
  },
  props: {
    /* Item's id */
    id: {  type: Number, default: null },
    /* Field type of ticket */
    typeId: { type: Number, default: null },
    /* Function to handle on edit */
    onEdit: {  type: Function, default: () => ({}) },
    /* Function to handle on delete */
    onWatch: {  type: Function, default: () => ({}) },
    /* Function to handle on delete */
    onStar: {  type: Function, default: () => ({}) },
    /* Function to handle on delete */
    onDelete: {  type: Function, default: () => ({}) },
    /* Flag if has this action */
    edit : { type: Boolean, default: false },
    /* Flag if has this action */
    watch: { type: Boolean, default: false },
    /* Flag if has this action */
    destroy: { type: Boolean, default: false },
    /* Flag if has this action */
    star: { type: Boolean, default: false },
  }
};
</script>

<style>
.tooltip-impact-ticket {
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_tooltip-width: var(--bbva-help-tooltip-width, 196px);
  --_help-tooltip-after-bg-color: #004486;
}
.color-text-impact-ticket {
  color: #5BBEFF;
}
</style>
