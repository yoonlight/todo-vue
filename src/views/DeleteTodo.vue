<template>
  <v-dialog v-model="dialog" @close="!dialog" max-width="600">
    <v-card>
      <v-card-title>
        Are you sure to delete todo?
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-action>
            <v-btn color="error" @click="deleteTodo(deleteItem._id)">YES</v-btn>
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
      type: Boolean,
      default: false
    }
  },
  // computed: {
  //   dialog: {
  //     get () {
  //       return this.deleteDialog
  //     },
  //     set (value) {
  //       console.log(this.deleteDialog)
  //       return this.deleteDialog
  //       //  this.$emit('input', value)
  //     }
  //   }
  // },
  // watch: {
  //   // deleteDialog() {
  //   //   this.dialog = this.deleteDialog
  //   // },
  //   dialog() {
  //     this.deleteDialog = this.dialog
  //     console.log(this.dialog)
  //   }
  // },
  data: () => ({
    dialog: this.deleteDialog
  }),
  methods: {
    deleteTodo: async function(id) {
      await this.axios
        .delete(`api/todo/${id}`)
        .then(result =>
          this.$toasted.success(result.data.message, { duration: 2000 })
        );
      await this.getTodo(this.offset, this.limit);
      this.deleteDialog = false;
    }
  }
};
</script>

<style></style>
