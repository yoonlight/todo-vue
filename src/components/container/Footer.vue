<template>
  <v-bottom-navigation grow app v-model="value" color="primary">
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
import { EventBus } from "../../utils/eventBus";

export default {
  data: () => ({ value: 1 }),
  watch: {
    value(newValue) {
      EventBus.$emit("update Complete", newValue);
    }
  }
};
</script>
