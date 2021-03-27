<template>
  <v-app-bar app color="primary" dark dense>
    <v-app-bar-nav-icon @click="drawerCtrl"></v-app-bar-nav-icon>
    <v-toolbar-title>
      Todo List
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
    />
    <v-spacer></v-spacer>
    <v-icon @click="logout">mdi-logout</v-icon>
  </v-app-bar>
</template>

<script>
import { EventBus } from "../../utils/eventBus";

export default {
  data: () => ({
    drawer: false
  }),

  methods: {
    async logout() {
      await this.axios.get("api/auth/logout").then(result => {
        this.$toasted.success(result.data.message, { duration: 2000 });
        localStorage.removeItem("user");
        this.$router.push("/login");
      });
    },
    drawerCtrl() {
      this.drawer = !this.drawer;
      EventBus.$emit("drawer", this.drawer);
    }
  }
};
</script>
