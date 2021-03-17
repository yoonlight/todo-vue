<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        Edit Data
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="edit.title" label="Title" required />
              </v-col>
              <v-col cols="10" md="11">
                <v-text-field v-model="edit.body" label="Todo" required />
              </v-col>
              <v-col cols="2" md="1">
                <v-list-item-action>
                  <v-icon @click="updateTodo(edit)">mdi-pencil</v-icon>
                </v-list-item-action>
              </v-col>
              <v-col cols="9" md="3">
                <v-list-item-action>
                  <v-rating v-model="edit.rate" />
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
export default {
  props: ["postTitle"],
  methods: {
    updateTodo: async function(val) {
      await this.axios.put(`api/todo/${val._id}`, val).then(result => {
        console.log(result);
        this.$toasted.success(result.data.message, { duration: 2000 });
        this.dialog = false;
      });
      await this.getTodo(this.offset, this.limit);
    }
  }
};
</script>

<style></style>
