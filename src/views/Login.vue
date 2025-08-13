<template>
  <v-app class="fondo-bbva">
    <v-container class="fill-height d-flex align-center justify-center ">
      <v-card class="pa-6 pt-10" width="100%" max-width="600">
        <v-card-title class="text-h5 font-weight-bold">Login</v-card-title>
        <v-card-text>

          <div class="pb-2">
            <bbva-web-form-text label="USUARIO" maxlength="10" class="text-input" :value="login.user"
              @input="(ev: any) => onInputChange('user', ev)" :invalid="!login.user && touched.user"
              :error-message="touched.user && !login.user ? 'El usuario es requerido' : ''"
              :required="true"></bbva-web-form-text>
          </div>

          <div class="pb-2">
            <bbva-web-form-text type="password" label="CONTRASEÑA" class="text-input" :value="login.password"
              @input="(ev: any) => onInputChange('password', ev)" :invalid="!login.password && touched.password"
              :error-message="touched.password && !login.password ? 'La contraseña es requerida' : ''"
              :required="true"></bbva-web-form-text>
          </div>
        </v-card-text>

        <v-card-actions class="d-flex justify-center">
          <bbva-button-default text="Continuar" :disabled="!valid" @click="onSubmit"></bbva-button-default>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>

</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import '@/components/bbva-web-components/bbva-web-form-text.js'
import '@/components/bbva-web-components/bbva-form-input.js'
import '@/components/bbva-web-components/bbva-web-form-select.js'
import '@/components/bbva-web-components/bbva-button-default.js'
import '@/components/bbva-web-components/bbva-foundations-icons.js'
import { useRouter } from 'vue-router'
const router = useRouter()


const testUsers = [
  { user: 'admin01', password: '1234', functionalCode: 0 }, // ADMIN
  { user: 'external01', password: 'abcd', functionalCode: 1 }, // EXTERNAL
  { user: 'internal01', password: 'pass', functionalCode: 2 }  // INTERNAL
]

const login = reactive({
  user: '',
  password: '',
})

const touched = reactive({
  user: false,
  password: false
})

const valid = computed(() => {
  return login.user.trim() !== '' && login.password.trim() !== ''
})

const rolNombre = (code: number) => {
  switch (code) {
    case 0: return 'ADMIN'
    case 1: return 'EXTERNAL'
    case 2: return 'INTERNAL'
    default: return 'DESCONOCIDO'
  }
}

const onInputChange = (field: keyof typeof login, ev: Event) => {
  const target = ev.target as HTMLInputElement
  login[field] = target.value
  touched[field] = true
}

const onSubmit = () => {
  touched.user = true
  touched.password = true

  if (!valid.value) {
    console.warn('Formulario inválido')
    return
  }

  const foundUser = testUsers.find(
    u => u.user === login.user && u.password === login.password
  )

  if (!foundUser) {
    alert('Usuario o contraseña incorrectos')
    return
  }

  const userData = {
    user: foundUser.user,
    functionalCode: foundUser.functionalCode,
    role: rolNombre(foundUser.functionalCode),
    isLogin: true
  }

  sessionStorage.setItem('userData', JSON.stringify(userData))

  router.push({ name: 'home' })

}
</script>

<style>
.fondo-bbva {
  background-color: #072146;
  min-height: 105vh;
}


.text-input input {
  position: absolute;
  top: 20%;
  left: 3%;
}
</style>
