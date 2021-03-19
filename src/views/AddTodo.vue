<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="todo.title"
                :rules="rules"
                label="Title"
                required
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="todo.body"
                :rules="rules"
                label="Todo"
                required
              />
            </v-col>
            <v-col cols="3" md="1">
              <v-list-item-action>
                <v-icon :disabled="!valid" @click="addTodo(todo)"
                  >mdi-plus</v-icon
                >
              </v-list-item-action>
            </v-col>
          </v-row>
        </v-form>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  data: () => ({
    todo: {},
    valid: true,
    rules: [v => !!v || "Required !!"]
  }),
  methods: {
    addTodo: async function(val) {
      if (this.$refs.form.validate()) {
        await this.axios
          .post(`api/todo`, val)
          .then(result =>
            this.$toasted.success(result.data, { duration: 2000 })
          );
        // await this.getTodo(this.offset, this.limit);
        // event 발생 시켜서 todo 에서 list refresh 가능하게!
        this.$refs.form.reset();
      }
    }
  }
};
</script>

<style></style>
