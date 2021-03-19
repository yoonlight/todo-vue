<template>
  <v-dialog v-model="dialog" max-width="600" @click.self="handleWrapperClick">
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
export default {
  created() {
    console.log(this.deleteDialog);
  },
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
      await this.axios
        .delete(`api/todo/${id}`)
        .then(result =>
          this.$toasted.success(result.data.message, { duration: 2000 })
        );
      // event 발생 시켜서 todo 에서 list refresh 가능하게!

      // await this.getTodo(this.offset, this.limit);
      this.deleteDialog = false;
    }
  }
};
</script>

<style></style>
