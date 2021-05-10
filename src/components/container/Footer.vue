<template>
  <v-bottom-navigation app fixed v-model="value" :value="value" color="primary">
    <v-btn>
      <span>All</span>
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <v-btn>
      <span>Ready</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>
    <v-btn>
      <span>Complete</span>
      <v-icon>mdi-map-marker</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data: () => ({ value: 1 }),
  computed: {
    theme() {
      return this.$route.params.theme;
    }
  },
  watch: {
    // value: {
    //   handler(val) {
    // this.$router.push(`/${this.theme}/${val}`);;
    //   }
    // },
    theme: {
      handler() {
        this.value = 1;
      }
    }
  }
};
</script>
