<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title> Edit Data </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-row v-if="item">
              <v-col cols="12">
                <v-text-field v-model="item.title" label="Title" required />
              </v-col>
              <v-col cols="10" md="11">
                <v-text-field v-model="item.body" label="Todo" required />
              </v-col>
              <v-col cols="2" md="1">
                <v-list-item-action>
                  <v-icon @click="updateTodo(item)">mdi-pencil</v-icon>
                </v-list-item-action>
              </v-col>
              <v-col cols="9" md="3">
                <v-list-item-action>
                  <v-rating v-model="item.rate" />
                </v-list-item-action>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from "../../utils/eventBus";
import api from "../../service/api";

export default {
  props: {
    editDialog: {
      type: Boolean
    },
    item: {
      type: Object
    }
  },
  watch: {
    editDialog() {
      if (this.editDialog == true) {
        this.dialog = this.editDialog;
      } else {
        this.dialog = !this.editDialog;
      }
      this.editItem = this.item;
    }
  },
  data: () => ({
    dialog: false,
    editItem: {}
  }),
  methods: {
    updateTodo: async function(body) {
      try {
        await api.todo.update(body);
        this.$toasted.success("Update Todo List", { duration: 2000 });
        EventBus.$emit("refreshEdit");
        this.dialog = false;
        console.log("close dialog");
        EventBus.$emit("update theme");
      } catch (e) {
        this.$toasted.error(e);
      }
    }
  }
};
</script>

<style></style>
