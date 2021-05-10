<template>
  <v-bottom-navigation :value="value" color="primary">
    <v-btn>
      <span>Recents</span>

      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn>
      <span>Favorites</span>

      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn>
      <span>Nearby</span>

      <v-icon>mdi-map-marker</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data: () => ({ value: 1 }),
  watch: {
    value: {
      async handler(val) {
        this.complete = this.filter[val].value;
        console.log(val);
        this.offset = 1;
        await this.getTodo(this.offset, this.limit);
        console.log("update complete");
      }
    }
  }
};
</script>
