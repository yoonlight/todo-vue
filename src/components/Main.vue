<template>
  <v-app>
    <Header />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "./container/AppFooter.vue";
import Header from "./container/Header.vue";

export default {
  components: {
    Header,
    Footer
  },

  data: () => ({
    //
  })
};
</script>
