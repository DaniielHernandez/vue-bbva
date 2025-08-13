<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <bbva-help-tooltip
    class="tooltip-setup-alert"
    :opened="open"
    verticalPlacement="bottom"
    horizontalPlacement="right"
    @help-tooltip-overlay-click="close"
    :id="`setup-alert-tooltip-${id}`"
  >
    <bbva-web-link
      slot="invoker"
      @click="show"
      size="m"
      class="fs-14 fw-500 primary pt-4 mb-4 short-width"
      icon="bbva:configuration"
      :iconLink="true"
      ></bbva-web-link>
    <div style="width: 40px" class="pt-1">
      <bbva-web-link
        class="color-text-setup-alert fw-500"
        icon="bbva:edit"
        @click="() => onAction('edit', id)">
        Editar
      </bbva-web-link>
      <bbva-web-link
        class="color-text-setup-alert fw-500"
        icon="bbva:addnotes"
        @click="() => onAction('duplicate', id)">
        Duplicar
      </bbva-web-link>
      <bbva-web-link
        class="color-text-setup-alert fw-500"
        icon="bbva:trash"
        @click="() => onAction('delete', id)">
        Eliminar
      </bbva-web-link>
      <bbva-web-link
        class="color-text-setup-alert fw-500"
        icon="bbva:alarm"
        @click="() => onAction('execute', id)">
        Ejecutar Alerta
      </bbva-web-link>
    </div>
  </bbva-help-tooltip>
</template>
<script>
// Components
import '@/components/bbva-web-components/bbva-help-tooltip.js'
import '@/components/bbva-web-components/bbva-web-link.js'
import '@/components/bbva-web-components/bbva-core-icon.js'
// Constants
import { ticketTypesIds } from '@/constants/impactTickets.js';

/*
 * This methos shows the tooltip to choose between availability and decimals
 */
export default {
  data() {
    return {
      open: false
    };
  },
  methods: {
    /*
     * Open the tooltip
     */
    show() {
      this.open = !this.open;
    },
    /*
     * Close the tooltip
     */
    close() {
      this.open = false;
    },
    /* It executes the actions*/
    onAction(action, id) {
      const actions = {
        edit: this.onEdit,
        delete: this.onDelete,
        duplicate: this.onDuplicate,
        execute: this.onExecute
      };
      actions[action](id);
      this.close();
    }
  },
  props: {
    id: { type: Number, default: 0 },
    /* Function to handle on edit */
    onEdit: {  type: Function, default: () => ({}) },
    /* Function to handle on delete */
    onDelete: {  type: Function, default: () => ({}) },
    /* Function to duplicate setup alert */
    onDuplicate: {  type: Function, default: () => ({}) },
    /* Function to execute the setup alert */
    onExecute: {  type: Function, default: () => ({}) }
  },
};
</script>

<style>
.tooltip-setup-alert {
  --_help-tooltip-overlay-bg-color: var(--bbva-help-tooltip-dark-mode-overlay-color, unset);
  --_help-tooltip-bg-color: var(--bbva-help-tooltip-dark-mode-background-color, #004486);
  --_tooltip-width: var(--bbva-help-tooltip-width, 196px);
  --_help-tooltip-after-bg-color: #004486;
}
.color-text-setup-alert {
  color: #5BBEFF;
  width: max-content;
}
.short-width {
  width: 17px;
}
</style>
