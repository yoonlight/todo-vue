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
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">프로젝트 추가</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="프로젝트 제목"
                    required
                    v-model="project"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="create()"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn icon @click="dialog = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import api from "../../service/api";
export default {
  data() {
    return {
      project: "",
      dialog: false
    };
  },
  methods: {
    async create() {
      await api.project.post({ title: this.project });
      this.dialog = false;
      location.reload();
    }
  }
};
</script>

<style></style>
