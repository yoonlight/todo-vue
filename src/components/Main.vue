<template>
  <v-app>
    <Header />
    <Drawer />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Drawer from "./container/Drawer.vue";
import Footer from "./container/Footer.vue";
import Header from "./container/Header.vue";

export default {
  components: {
    Header,
    Footer,
    Drawer
  },

  data: () => ({
    //
  })
};
</script>
