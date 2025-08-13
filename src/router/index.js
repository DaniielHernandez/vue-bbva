// Composable
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/setup/admin-models-environments',
    name: 'admin-models-environments',
    component: () => import('@/views/setup/admin-models-environments/AdminModelsEnvironments.vue')
  },
  {
    path: '/setup/admin-models-environments/create-model-operatives',
    name: 'admin-models-environments-operatives',
    component: () =>
      import('@/views/setup/admin-models-environments/AdminModelsEnvironmentsOperatives.vue')
  },
  {
    path: '/environments-validations',
    name: 'environments-validations',
    component: () => import('@/views/validations-environments/ValidationsEnvironmentView.vue')
  },
  {
    path: '/setup/admin-models-environments/create-model',
    name: 'admin-models-environments-create-model',
    component: () =>
      import('@/views/setup/admin-models-environments/AdminModelsEnvironmentsCreateModel.vue')
  },
  {
    path: '/setup/admin-models-environments/summary-model/:id',
    name: 'admin-models-environments-summary',
    component: () => import('@/views/setup/admin-models-environments/SummaryModel.vue')
  },
  {
    path: '/setup/admin-catalogs/admin-environments',
    name: 'admin-environments',
    component: () => import('@/views/setup/admin-catalogs/AdminEnvironments.vue')
  },
  {
    path: '/setup/setup-alerts',
    name: 'setup-alerts',
    component: () => import('@/views/setup/SetupAlerts.vue')
  },
  {
    path: '/setup/setup-alerts/create',
    name: 'setup-alerts-create',
    component: () => import('@/views/setup/setup-alerts/Form.vue')
  },
  {
    path: '/setup/setup-alerts/:id',
    name: 'setup-alerts-edit',
    component: () => import('@/views/setup/setup-alerts/Form.vue')
  },
  {
    path: '/impact-adjustments/add-adjustment',
    name: 'add-adjustment',
    component: () => import('@/views/impact-adjustments/add-adjustment/AddAdjustment.vue')
  },
  {
    path: '/impact-adjustments',
    name: 'impact-adjustments',
    component: () => import('@/views/impact-adjustments/ImpactAdjustmentsView.vue')
  },
  {
    path: '/service-levels/setup-dashboard',
    name: 'setup-dashboard',
    component: () => import('@/views/service-levels/SetupDashboardView.vue')
  },
  {
    path: '/service-levels',
    name: 'service-levels',
    component: () => import('@/views/service-levels/ServiceLevelsView.vue')
  },
  {
    path: '/service-levels/cfs-cbp-operative',
    name: 'service-levels-cfs',
    component: () => import('@/views/service-levels/ServiceLevelsCfsView.vue')
  },
  {
    path: '/service-levels/cfs-cbp-operative/detail',
    name: 'service-levels-cfs-detail',
    component: () => import('@/views/service-levels/DetailView.vue')
  },
  {
    path: '/service-levels/cfs-cbp-operative/detail/impact',
    name: 'service-levels-cfs-detail-impact',
    component: () => import('@/views/service-levels/ImpactView.vue')
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/setup/SetupView.vue')
  },
  {
    path: '/setup/users-and-roles',
    name: 'user-and-roles',
    component: () => import('@/views/setup/UserAndRoles.vue')
  },
  {
    path: '/setup/admin-catalogs',
    name: 'admin-catalgogs',
    component: () => import('@/views/setup/AdminCatalogs.vue')
  },
  {
    path: '/setup/admin-catalogs/admin-business-unit',
    name: 'admin-business-unit',
    component: () => import('@/views/setup/admin-catalogs/AdminBusinessUnit.vue')
  },
  {
    path: '/setup/admin-catalogs/admin-cfs',
    name: 'admin-cfs',
    component: () => import('@/views/setup/admin-catalogs/AdminCfs.vue')
  },
  {
    path: '/setup/non-working-days',
    name: 'non-working-days',
    component: () => import('@/views/setup/NonWorkingDays.vue')
  },
  {
    path: '/setup/admin-models',
    name: 'admin-models',
    component: () => import('@/views/setup/AdminModels.vue')
  },
  {
    path: '/setup/admin-models/view/:id',
    name: 'model-view',
    component: () => import('@/views/setup/admin-models/Model.vue')
  },
  {
    path: '/setup/admin-models/form',
    name: 'model-new',
    component: () => import('@/views/setup/admin-models/NewModel.vue')
  },
  {
    path: '/setup/admin-models/form/:id',
    name: 'model-edit',
    component: () => import('@/views/setup/admin-models/NewModel.vue')
  },
  {
    path: '/setup/values-d1',
    name: 'values-d1',
    component: () => import('@/views/setup/ValuesD1.vue')
  },
  {
    path: '/impact-tickets/omega',
    name: 'omega',
    component: () => import('@/views/impact-tickets/OmegaReport.vue')
  },
  {
    path: '/impact-tickets',
    name: 'impact-tickets',
    component: () => import('@/views/impact-tickets/ImpactTickets.vue')
  },
  {
    path: '/impact-tickets/impacts-by-category',
    name: 'impacts-by-category',
    component: () => import('@/views/impact-tickets/ImpactsByCategory.vue')
  },
  {
    path: '/response-times',
    name: 'response-times',
    component: () => import('@/views/response-times/ResponseTimes.vue')
  },
  {
    path: '/response-times/cfs-cbp-operative',
    name: 'response-times-cfs',
    component: () => import('@/views/response-times/ResponseTimesCfs.vue')
  },
  {
    path: '/event-map',
    name: 'event-map',
    component: () => import('@/views/event-map/EventMapView.vue')
  },
  {
    path: '/response-times/cfs-cbp-operative/detail',
    name: 'response-times-cfs-detail',
    component: () => import('@/views/response-times/ResponseTimesDetail.vue')
  },
  {
    path: '/impact-tickets/cfs',
    name: 'impact-tickets-cfs',
    component: () => import('@/views/impact-tickets/CfsView.vue')
  },
  {
    path: '/impact-tickets/cfs/operatives',
    name: 'impact-tickets-cfs-operatives',
    component: () => import('@/views/impact-tickets/OperativesView.vue')
  },
  {
    path: '/impact-tickets/impacts-by-category/taxpayerTrend',
    name: 'impact-tickets-impacts-by-category-taxpayerTrend',
    component: () => import('@/views/impact-tickets/impacts-by-category/TaxpayerTrend.vue')
  },
  {
    path: '/alerts/alert-notifications',
    name: 'alert-notifications',
    component: () => import('@/views/alerts/AlertNotificationsView.vue')
  },
  {
    path: '/alerts/unattended-alerts',
    name: 'unattended-alerts',
    component: () => import('@/views/alerts/UnattendedAlertsView.vue')
  }
]

const router = createRouter({
  // eslint-disable-next-line no-undef
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
