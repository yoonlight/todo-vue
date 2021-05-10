<template>
  <v-navigation-drawer app v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> Todo List </v-list-item-title>
        <v-list-item-subtitle> username </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-group :value="true">
        <template v-slot:activator>
          <v-list-item-title>Todo List</v-list-item-title>
        </template>
        <v-list-item
          v-for="item in items"
          :key="item.id"
          link
          :to="{ path: `/${item}` }"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { EventBus } from "../../utils/eventBus";
import api from "../../service/api";
export default {
  async created() {
    this.items = await this.getTheme();
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
      this.items = await this.getTheme();
    });
  },
  data: () => ({
    drawer: false,
    items: [],
    right: null
  }),
  methods: {
    async getTheme() {
      const result = await api.todo.theme();
      return result.data;
    }
  }
};
</script>
