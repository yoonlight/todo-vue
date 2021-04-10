<template>
  <v-container style="max-width: 500px">
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

    <h2 class="display-1 success--text pl-4">
      Tasks:&nbsp;
      <v-fade-transition leave-absolute>
        <span :key="`tasks-${todos.length}`">
          {{ todos.length }}
        </span>
      </v-fade-transition>
    </h2>

    <v-divider class="mt-4"></v-divider>

    <v-row class="my-1" align="center">
      <strong class="mx-4 info--text text--darken-2">
        Remaining: {{ remainingTasks }}
      </strong>

      <v-divider vertical></v-divider>

      <strong class="mx-4 success--text text--darken-2">
        Completed: {{ completedTasks }}
      </strong>

      <v-spacer></v-spacer>

      <v-progress-circular :value="progress" class="mr-2"></v-progress-circular>
    </v-row>

    <v-divider class="mb-4"></v-divider>

    <v-card v-if="todos.length > 0">
      <v-slide-y-transition class="py-0" group tag="v-list">
        <template v-for="(task, i) in todos">
          <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
          <v-list-item :key="`${i}-${task.body}`">
            <v-list-item-action>
              <v-checkbox
                v-model="task.complete"
                :color="(task.complete && 'grey') || 'primary'"
              >
                <template v-slot:label>
                  <div
                    :class="(task.complete && 'grey--text') || 'primary--text'"
                    class="ml-4"
                    v-text="task.body"
                  ></div>
                </template>
              </v-checkbox>
            </v-list-item-action>

            <v-spacer></v-spacer>

            <v-scroll-x-transition>
              <v-icon v-if="task.complete" color="success">
                mdi-check
              </v-icon>
            </v-scroll-x-transition>
          </v-list-item>
        </template>
      </v-slide-y-transition>
    </v-card>
  </v-container>
</template>

<script>
import api from "../../service/api";

export default {
  async created() {
    await this.getTodo(this.offset, this.limit);
  },
  data: () => ({
    newTask: null,
    todos: [],
    pagination: {},
    offset: 1,
    limit: 5,
    complete: false
  }),

  computed: {
    completedTasks() {
      return this.todos.filter(task => task.complete).length;
    },
    progress() {
      return (this.completedTasks / this.todos.length) * 100;
    },
    remainingTasks() {
      return this.todos.length - this.completedTasks;
    }
  },

  methods: {
    async create() {
      const body = {
        body: this.newTask,
        title: ""
      };
      const result = await api.todo.post(body);
      this.$toasted.success(result.data, { duration: 2000 });
      this.newTask = null;
    },
    getTodo: async function(offset, limit) {
      let query = ``;
      if (this.complete != "undefined") {
        query = `&complete=${this.complete}`;
      }

      const data = await api.todo
        .list(offset, limit, query)
        .then(result => result.data);
      this.todos = data.query;
      this.pagination = data.pagination;
      console.log("refresh");
      console.log(this.todos);
      console.log(this.pagination);
    }
  }
};
</script>
