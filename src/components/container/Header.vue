<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
        elevate-on-scroll
      />
    </div>
    <v-toolbar-title>
      Todo List
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="logout" text>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.axios.get("api/auth/logout").then(result => {
        this.$toasted.success(result.data.message, { duration: 2000 });
        localStorage.removeItem("user");
        this.$router.push("/login");
      });
    }
  }
};
</script>
