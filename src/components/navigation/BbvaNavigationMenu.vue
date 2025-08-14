<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <aside class="menu-container" ref="container" @mouseover="() => openMenu()" @mouseleave="() => closeMenu()"
    @focusin="() => openMenu()" @focusout="() => closeMenu()">
    <bbva-web-navigation-menu item-groups="3" exit-text="Log out" ref="menu" style="z-index: 300"
      @menu-item-click="(ev) => navigateTo(ev.target.value)" @exit-click="(ev) => logOut()">
      <bbva-web-navigation-menu-item icon="bbva:home" slot="group1" value="/">
        Inicio
      </bbva-web-navigation-menu-item>

      <bbva-web-navigation-menu-item icon="bbva:graphics" slot="group1" value="executiveSumup">
        Resumen Ejecutivo
      </bbva-web-navigation-menu-item>

      <bbva-web-navigation-menu-item slot="group1" value="service-levels"
        :hidden="!(hover && opened.includes('executiveSumup'))">
        Disponibilidad
      </bbva-web-navigation-menu-item>
      <bbva-web-navigation-menu-item slot="group1" value="response-times"
        :hidden="!(hover && opened.includes('executiveSumup'))">
        Tiempo de respuesta
      </bbva-web-navigation-menu-item>

      <bbva-web-navigation-menu-item icon="bbva:maxminscreen" slot="group1" value="impact-adjustments">
        Ajustes de impacto
      </bbva-web-navigation-menu-item>

      <bbva-web-navigation-menu-item icon="bbva:editticket" slot="group2" value="impactTickets">
        Folios con impacto
      </bbva-web-navigation-menu-item>
      <bbva-web-navigation-menu-item slot="group2" value="impact-tickets"
        :hidden="!(hover && opened.includes('impactTickets'))">
        Por folios
      </bbva-web-navigation-menu-item>
      <bbva-web-navigation-menu-item slot="group2" value="impacts-by-category"
        :hidden="!(hover && opened.includes('impactTickets'))">
        Por Categoría
      </bbva-web-navigation-menu-item>
      <bbva-web-navigation-menu-item slot="group2" value="event-map"
        :hidden="!(hover && opened.includes('impactTickets'))">
        Mapa de eventos
      </bbva-web-navigation-menu-item>
      <bbva-web-navigation-menu-item slot="group2" value="omega" :hidden="!(hover && opened.includes('impactTickets'))">
        Informe omega
      </bbva-web-navigation-menu-item>

      <bbva-web-navigation-menu-item icon="bbva:settings" slot="group2" value="setup">
        Acciones de configuración
      </bbva-web-navigation-menu-item>

      <bbva-web-navigation-menu-item class="alert-notificacions-menu-item" icon="bbva:alarm" slot="group3"
        value="alerts">
        Alertas
      </bbva-web-navigation-menu-item>
      <bbva-web-navigation-menu-item slot="group3" value="alert-notifications"
        :hidden="!(hover && opened.includes('alerts'))">
        <span v-if="notificationCount > 0" class="link-notification-badge">{{
          notificationCount
        }}</span>
        Notificadas
      </bbva-web-navigation-menu-item>
      <bbva-web-navigation-menu-item slot="group3" value="unattended-alerts"
        :hidden="!(hover && opened.includes('alerts'))">
        No atendidas
      </bbva-web-navigation-menu-item>

      <bbva-web-navigation-menu-item icon="bbva:graphics" slot="group3" value="environments-validations">
        Validación entornos previos
      </bbva-web-navigation-menu-item>
    </bbva-web-navigation-menu>
  </aside>
</template>

<script type="module">
// Components
import '@/components/bbva-web-components/bbva-web-navigation-menu.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
// Badge that will be appended to menu's alert bell to display notification's count
const badgeDiv = document.createElement('div')
badgeDiv.classList.add('menu-notification-badge')
badgeDiv.style.position = 'absolute'
badgeDiv.style.top = '-11px'
badgeDiv.style.right = '-12px'
badgeDiv.style.display = 'flex'
badgeDiv.style.justifyContent = 'center'
badgeDiv.style.alignItems = 'center'
badgeDiv.style.height = '16px'
badgeDiv.style.width = '16px'
badgeDiv.style.border = '1px solid #fff'
badgeDiv.style.borderRadius = '50%'
badgeDiv.style.backgroundColor =
  'var(--bbva-web-badge-notification-alert-bg-color, var(--colorsTertiaryType1Dark, #b92a45))'
badgeDiv.style.fontSize = '12px'

export default {
  data() {
    return {
      hover: false,
      opened: [],
      submenus: {
        executiveSumup: ['service-levels', 'response-times'],
        impactTickets: ['impact-tickets', 'impacts-by-category', 'event-map', 'omega'],
        alerts: ['alert-notifications', 'unattended-alerts'],
        environments: ['environments-validations']
      }
    }
  },
  computed: {},
  methods: {
    parentMenu(item) {
      let name = ''
      Object.keys(this.submenus).every((key) => {
        if (this.submenus[key].includes(item)) {
          name = key
          return false
        }
        return true
      })
      return name
    },
    isParent(name) {
      return Object.keys(this.submenus).includes(name)
    },
    openMenu() {
      this.$refs.container.setAttribute('expanded', '')
      this.$refs.menu.expanded = true
      this.hover = true

      if (this.parentMenu(this.$route.name)) {
        this.$refs.menu.value = this.$route.name
      }
    },
    closeMenu() {
      this.$refs.container.removeAttribute('expanded')
      this.$refs.menu.expanded = false
      this.hover = false

      const parentName = this.parentMenu(this.$refs.menu.value)

      if (parentName) {
        this.$refs.menu.value = parentName
      }
    },
    switchParentOption(name) {
      if (this.submenus[name] && !this.submenus[name].includes(this.$route.name)) {
        if (this.opened.includes(name)) {
          this.opened = this.opened.filter((item) => item !== name)
        } else {
          this.opened.push(name)
        }
      }
    },
    navigateTo(name) {
      if (name === '') return
      if (this.isParent(name)) {
        this.switchParentOption(name)
        if (!this.submenus[name].includes(this.$route.name)) {
          this.$refs.menu.value = this.$route.name
        }
        return
      }

      if (name === this.$route.name) return

      this.$refs.menu.value = name
      this.$router.push({ name: name })
    },
    updateSelectedItem() {
      const name = this.$route.name
      if (name === '') return
      const parentName = this.parentMenu(name)

      if (parentName) {
        this.$refs.menu.value = parentName
        this.opened.push(parentName)
      } else {
        this.$refs.menu.value = name
      }
    },
    /**
     *  Appends the constant badgeDiv to the menu's bell
     *
     * @param amount {Number} The amount that should be displayed. If it excedes 99,
     *                        we won't show any number
     */
    appendNotificationBadge(amount) {
      const alertIconContainer = document
        .querySelector('bbva-web-navigation-menu-item.alert-notificacions-menu-item')
        .shadowRoot.querySelector('bbva-web-navigation-menu-item-action')
        .shadowRoot.querySelector('bbva-core-icon.item-icon')
      if (amount) {
        if (amount > 99) {
          badgeDiv.textContent = ''
        } else {
          badgeDiv.textContent = amount
        }
      }
      alertIconContainer.appendChild(badgeDiv)
    },
    /**
     * Remnoves badgeDiv from the menu's alert bell
     */
    removeNotificationBadge() {
      badgeDiv.remove()
    },

    logOut() {
      sessionStorage.clear()
      this.emitter.emit('loginStatusChanged', false)
      this.$router.push({ name: 'login' })
    },

  },
  mounted() {
    this.updateSelectedItem()
  },
  props: {
    notificationCount: {
      type: Number,
      default: 0
    }
  },
  watch: {
    /**
     * Logic to display a new number if we recieve any number from the backend
     * to notify the user
     */
    notificationCount(newCount) {
      if (newCount > 0) {
        this.appendNotificationBadge(newCount)
      } else {
        this.removeNotificationBadge()
      }
    },
    /**
     * Logic to watch when the user hovers on or off the menu and
     * add or remove respectively the notifications badge from the menu's alert bell
     *
     * @param newValue The new value for 'hover' to check if the menu is open via mose hover
     */
    hover(newValue) {
      if (newValue) {
        this.removeNotificationBadge()
      } else if (this.notificationCount && !newValue) {
        setTimeout(() => this.appendNotificationBadge(this.notificationCount), 450)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menu-container {
  --bbva-web-navigation-menu-transition-delay: 0.3s;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4rem;
  transition: width 0.15s 0.3s ease-in-out;
  z-index: 200;
}

.menu-container[expanded] {
  width: 15rem;
  z-index: 200;
}

.link-notification-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 16px;
  width: 16px;
  margin-right: 4px;
  border: 1px solid #fff;
  border-radius: 50%;
  background-color: var(--bbva-web-badge-notification-alert-bg-color,
      var(--colorsTertiaryType1Dark, #b92a45));
  font-size: 12px;
}
</style>
