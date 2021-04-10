<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        Are you sure to delete todo?
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-action>
            <v-btn color="error" @click="deleteTodo(deleteId)">YES</v-btn>
          </v-list-item-action>
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
    deleteDialog: {
      type: Boolean
    },
    deleteId: {
      type: String
    }
  },
  watch: {
    deleteDialog() {
      if (this.deleteDialog == true) {
        this.dialog = this.deleteDialog;
      } else {
        this.dialog = !this.deleteDialog;
      }
      console.log(this.deleteId);
    },

    dialog() {
      console.log(this.dialog);
    }
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    deleteTodo: async function(id) {
      const result = await api.todo.delete(id);
      this.$toasted.success(result.data.message, { duration: 2000 });
      EventBus.$emit("refreshDelete");
      this.dialog = false;
      console.log("close dialog");
    }
  }
};
</script>

<style></style>
