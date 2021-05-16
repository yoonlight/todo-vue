<template>
  <v-bottom-navigation
    app
    v-model="value"
    color="primary"
    v-if="$route.name === 'Home'"
  >
    <v-btn>
      <span>All</span>
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <v-btn>
      <span>Active</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>
    <v-btn>
      <span>Completed</span>
      <v-icon>mdi-map-marker</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { EventBus } from "../../utils/eventBus";

export default {
  created() {
    console.log(this.$route);
  },
  data: () => ({ value: 1 }),
  watch: {
    value(newValue) {
      EventBus.$emit("update Complete", newValue);
    }
  }
};
</script>
