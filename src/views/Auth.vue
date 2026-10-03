<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { motion, AnimatePresence } from 'motion-v'
import { signIn, signUp, user, demo } from '../store'
import Logo from '../components/Logo.vue'
import { t } from '../i18n'
const mode = ref('login'), f = reactive({ full_name: '', phone: '', email: '', password: '' })
const err = ref(''), info = ref(''), busy = ref(false), route = useRoute(), router = useRouter()
async function go() {
  err.value = info.value = ''; busy.value = true
  try {
    mode.value === 'login' ? await signIn(f.email, f.password) : await signUp({ ...f })
    if (!user.value) { info.value = t('auth.confirm'); mode.value = 'login'; return }
    router.push(route.query.redirect || (user.value.role === 'admin' ? '/admin' : '/compte'))
  } catch (e) { err.value = t(e.message) } finally { busy.value = false }
}
</script>
<template>
  <main class="auth">
    <aside class="aside"><Logo /><p>{{ t('auth.aside') }}</p></aside>
    <section class="acard">
      <div class="tabs">
        <button v-for="tb in [['login', t('auth.login')], ['signup', t('auth.signup')]]" :key="tb[0]" type="button" :class="{ on: mode === tb[0] }" @click="mode = tb[0]; err = ''">{{ tb[1] }}<motion.span v-if="mode === tb[0]" layoutId="u" class="ul" />
        </button>
      </div>
      <p v-if="demo" class="demo">Mode démo : admin@binlenoir.ci / admin123</p>
      <form @submit.prevent="go">
        <AnimatePresence mode="wait">
          <motion.div :key="mode" class="fields" :initial="{ opacity: 0, x: 24 }" :animate="{ opacity: 1, x: 0 }" :exit="{ opacity: 0, x: -24 }" :transition="{ duration: 0.25 }">
            <template v-if="mode === 'signup'">
              <label class="fld">{{ t('auth.name') }}<input v-model="f.full_name" required autocomplete="name" /></label>
              <label class="fld">{{ t('auth.phone') }}<input v-model="f.phone" type="tel" required autocomplete="tel" placeholder="07 00 00 00 00" /></label>
            </template>
            <label class="fld">{{ t('auth.email') }}<input v-model="f.email" type="email" required autocomplete="email" /></label>
            <label class="fld">{{ t('auth.pass') }}<input v-model="f.password" type="password" required minlength="6" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" /></label>
          </motion.div>
        </AnimatePresence>
        <p v-if="err" class="msg error">{{ err }}</p><p v-if="info" class="msg ok">{{ info }}</p>
        <button class="btn red" :disabled="busy">{{ busy ? t('auth.wait') : mode === 'login' ? t('auth.go') : t('auth.create') }}</button>
      </form>
    </section>
  </main>
</template>
