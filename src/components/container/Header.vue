<template>
  <div>
    <v-app-bar app flat color="white" absolute dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <v-toolbar-title v-if="items">
        {{
        }}
      </v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-icon @click="logout">mdi-logout</v-icon>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Todo List </v-list-item-title>
          <v-list-item-subtitle> username </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-group :value="true" v-for="item in items" :key="item.id">
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>
          <v-list-item
            v-for="subject in item.subject"
            :key="subject.id"
            link
            :to="{ path: `/${item.id}/${subject.id}` }"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subject.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { EventBus } from "../../utils/eventBus";
import api from "../../service/api";
export default {
  async created() {
    const result = await this.getTheme();
    this.items = result[0];
    console.log(this.items);
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
    async logout() {
      await api.auth.logout().then(result => {
        this.$toasted.success(result.data.message, { duration: 2000 });
        localStorage.removeItem("user");
        this.$router.push({ name: "Login" });
      });
    },
    async getTheme() {
      const result = await api.project.list();
      return result.data;
    }
  }
};
</script>
