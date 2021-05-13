<template>
  <v-app>
    <v-app-bar app flat color="white" absolute dense>
      <v-btn icon>
        <router-link
          :to="`/`"
          class="grey--text text--darken-1 text-decoration-none"
        >
          <v-icon>mdi-keyboard-backspace</v-icon>
        </router-link>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn icon>
        <router-link
          :to="`/register`"
          class="grey--text text--darken-1 text-decoration-none"
        >
          <v-icon>mdi-plus</v-icon>
        </router-link>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {};
</script>

<style></style>
