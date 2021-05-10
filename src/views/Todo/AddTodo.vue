<template>
  <div>
    <v-text-field
      v-model="newTask"
      label="What are you working on?"
      solo
      @keydown.enter="create"
    >
      <template v-slot:append>
        <v-fade-transition>
          <v-icon v-if="newTask" @click="create">
            mdi-plus-circle
          </v-icon>
        </v-fade-transition>
      </template>
    </v-text-field>
    <!-- <v-list-item>
      <v-list-item-content>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="10" md="5">
              <v-text-field
                v-model="todo.body"
                :rules="rules"
                label="Todo"
                required
              />
            </v-col>
            <v-col cols="2" md="1">
              <v-list-item-action>
                <v-icon :disabled="!valid" @click="addTodo(todo)"
                  >mdi-plus</v-icon
                >
              </v-list-item-action>
            </v-col>
          </v-row>
        </v-form>
      </v-list-item-content>
    </v-list-item> -->
  </div>
</template>

<script>
import { EventBus } from "../../utils/eventBus";
import api from "../../service/api";
export default {
  computed: {
    theme: function() {
      return this.$route.params.theme;
    }
  },
  data: () => ({
    newTask: null,
    todo: {},
    valid: true,
    rules: [v => !!v || "Required !!"]
  }),
  methods: {
    addTodo: async function(val) {
      if (this.$refs.form.validate()) {
        val.title = this.theme;
        const result = await api.todo.post(val);
        this.$toasted.success(result.data, { duration: 2000 });
        this.$refs.form.reset();
        EventBus.$emit("refreshAdd");
      }
    },
    async create() {
      const body = {
        body: this.newTask,
        title: this.theme
      };
      const result = await api.todo.post(body);
      this.$toasted.success(result.data, { duration: 2000 });
      this.newTask = null;
      EventBus.$emit("refreshAdd");
    }
  }
};
</script>

<style></style>
