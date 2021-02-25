<template>
  <v-app>
    <Header />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./container/Header.vue";

export default {
  components: {
    Header
  },

  data: () => ({
    //
  })
};
</script>
