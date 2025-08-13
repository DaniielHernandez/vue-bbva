<template>
  <v-app>
    <v-main>
      <information-modal
        :open="modal.open"
        :close="closeModal"
        :confirmation="modal.confirmation"
        :onAccept="modal.onAccept"
        :title="modal.title"
        :forceOnAccept="modal.forceOnAccept"
        :message="modal.message"
        :type="modal.type"
      />
      <div v-if="access">
        <bbva-navigation-menu v-if="showMenu" :notificationCount="notificationCount" ref="menu" />
        <div :class="showMenu ? 'pl-14' : ''">
          <router-view></router-view>
        </div>
        <overlay-loader :open="loading || validating" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import InformationModal from '@/components/modals/InformationModal.vue'
import { errorRequestModal } from '@/utils/informationModal'
import OverlayLoader from '@/components/loaders/OverlayLoader.vue'
import BbvaNavigationMenu from '@/components/navigation/BbvaNavigationMenu.vue'
// Requests
import { checkPermissionAPI } from '@/requests/security.js'
import { getNotificationCount } from '@/requests/alerts'
// Constants
import { REQUEST_NOTIFICATIONS_INTERVAL } from '@/constants/alertNotifications'
const supportedLanguages = ['en', 'en-US', 'es', 'es-ES', 'es-US']
const defaultLanguage = 'en-US'
window.IntlMsg = window.IntlMsg || {}
window.IntlMsg.lang = supportedLanguages.includes(navigator.language)
  ? navigator.language
  : defaultLanguage
window.IntlMsg.localesHost = `${window.location.protocol}//${window.location.host}`
window.IntlMsg.url = 'locales.json'

export default {
  data() {
    return {
      /* Flag, true if it the user has access to the current view */
      access: false,
      /* Flag, true if it is loading */
      loading: false,
      /* Object with data used by the modal component */
      modal: {
        open: false,
        onAccept: () => ({}),
        title: 'Permiso denegado',
        message: 'No tienes permiso para acceder a esta vista',
        type: 'caution',
        forceOnAccept: false,
        confirmation: false
      },
      /* The number of notifications for the user */
      notificationCount: null,
      /* the id for the time interval that is set to periodically
       * check for notification's count updates
       */
      notificationIntervalId: null,
      /* Flag, true if the menu must be showed */
      showMenu: true,
      /* Flag, true when it's validating the permission of the current view */
      validating: false
    }
  },
  components: {
    BbvaNavigationMenu,
    InformationModal,
    OverlayLoader
  },
  mounted() {
    this.setupNotifications()
    /*
     * Handle's the refresh of the notification count when one is marked
     * as 'attended' in the AlertNotificationsView component
     */
    this.emitter.on('refreshNotifications', (vt) => this.setupNotifications())
    /* Emmit to handle loading and show the loader */
    this.emitter.on('load', (evt) => {
      this.loading = evt.loading
    })
    /* Emmit to handle error and show the modal */
    this.emitter.on("error", (evt) => {
      this.errorInRequestModal(evt.action, evt.error);
      console.error(evt.error);
    });
    /* Emmit to handle informational data and show the modal */
    this.emitter.on('informational', (evt) => {
      this.modal = {
        open: true,
        ...evt
      }
    })
  },
  methods: {
    /*
     * It closes the modal and redirect if the user not has permission
     * to access to the current view
     */
    closeModal() {
      this.modal = {
        open: false,
        onAccept: () => ({}),
        confirmation: false,
        title: '',
        message: '',
        type: '',
        forceOnAccept: false
      }
      if (!this.access) {
        this.$router.replace('/')
      }
    },
    /*
     * It creates the object error to be showed by the modal and opens the modal
     * @param {String} action  Description of the action that raise the error
     * @param {Object} error   Object returned by any request
     */
    errorInRequestModal(action, error) {
      this.modal = {
        open: true,
        ...errorRequestModal(action, error)
      }
    },
    /**
     * Retrieves from backend the number of notifications for the user
     * to be displayed in the menu
     */
    getNotificationCountForBadge() {
      getNotificationCount()
        .then(({ data }) => {
          this.notificationCount = data.numberNotifications
        })
        .catch(({ response }) => {
          if (response.status === 403) {
            this.notificationIntervalId = null
          }
        })
    },
    /**
     * Sets up the notification system
     */
    setupNotifications() {
      this.getNotificationCountForBadge()
      this.notificationIntervalId = setInterval(
        this.getNotificationCountForBadge,
        REQUEST_NOTIFICATIONS_INTERVAL
      )
    }
  },
  watch: {
    /*
     * It follows the instance route to validate the permissions over views
     */
    $route() {
      const noMenuRoutes = ['model-new', 'model-edit'];
      const path = this.$route.path.replace(/\/\d+/, '');
      if( [
          '/'
        ].includes(path)
      ) {
        this.access = true;
      } else {
        this.validating = true;
        checkPermissionAPI(path).then( (response) => {
          if( !response.data.success ) {
            this.access = false;
            this.modal = {
              open: true,
              type: 'caution',
              title: 'obtener datos',
              message: 'No tienes permiso para obtener estos datos'
            };


          } else {
            this.access = true;
          }

          this.validating = false;
        }).catch( (error) => {
          this.access = false;
          this.modal.open = true;

          this.validating = false;
        });
      }

      if( noMenuRoutes.includes( this.$route.name ) ) {
        this.showMenu = false;
      } else {
        this.showMenu = true;
      }
    }
  }
}
</script>
