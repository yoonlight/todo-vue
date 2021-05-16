<template>
  <div>
    <v-app-bar app flat color="white" absolute dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon>
        <v-icon @click="logout">mdi-logout</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs v-model="tabs" fixed-tabs>
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#0" class="primary--text">
            <span>All</span>
          </v-tab>

          <v-tab href="#1" class="primary--text">
            <span>Active</span>
          </v-tab>

          <v-tab href="#2" class="primary--text">
            <span>Completed</span>
          </v-tab>
        </v-tabs>
      </template>
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
            :to="{ path: `/list/${item.id}/${subject.id}` }"
          >
            <v-list-item-content>
              <v-list-item-title
                @click="title = subject.title"
                v-text="subject.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="group"> Manage Group </v-btn>
        </div>
      </template>
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
    right: null,
    title: "All",
    tabs: 1
  }),
  watch: {
    tabs(newValue) {
      console.log(newValue);
      EventBus.$emit("update Complete", newValue);
    }
  },
  methods: {
    group() {
      this.$router.push({ path: "/group" });
    },
    async logout() {
      await api.auth.logout().then(result => {
        this.$toasted.success(result.data.message, { duration: 2000 });
        localStorage.removeItem("accessToken");
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
