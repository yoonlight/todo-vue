<template>
  <v-app-bar app flat color="white" absolute dense>
    <v-app-bar-nav-icon @click="drawerCtrl"></v-app-bar-nav-icon>
    <v-toolbar-title> {{ theme }} </v-toolbar-title>
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
  computed: {
    theme: function() {
      return this.$route.params.theme;
    }
  },
  methods: {
    async logout() {
      await this.axios.get("/api/auth/logout").then(result => {
        this.$toasted.success(result.data.message, { duration: 2000 });
        localStorage.removeItem("user");
        this.$router.push("auth");
      });
    },
    drawerCtrl() {
      this.drawer = !this.drawer;
      EventBus.$emit("drawer", this.drawer);
    }
  }
};
</script>
