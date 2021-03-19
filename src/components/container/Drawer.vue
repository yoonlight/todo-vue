<template>
  <v-navigation-drawer app v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Application
        </v-list-item-title>
        <v-list-item-subtitle>
          subtext
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.id" link>
        <v-list-item-content>
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { EventBus } from "../../utils/eventBus";

export default {
  data: () => ({
    drawer: false,
    items: [],
    right: null
  }),
  watch: {
    drawer() {
      console.log(this.drawer);
    }
  },
  methods: {
    clicktheme() {
      // EventBus.$emit("go to specific theme");
    }
  },
  async created() {
    this.items = await this.axios
      .get("api/todo/theme")
      .then(result => result.data);
    EventBus.$on("drawer", drawer => {
      if (drawer == true) {
        this.drawer = drawer;
      } else if (drawer == false && this.drawer == true) {
        this.drawer = drawer;
      } else {
        this.drawer = !drawer;
      }
    });
    EventBus.$on("update theme", async () => {
      this.items = await this.axios
        .get("api/todo/theme")
        .then(result => result.data);
    });
  }
};
</script>
