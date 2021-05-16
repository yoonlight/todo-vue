<template>
  <div>
    <v-list>
      <v-list-group v-for="item in items" :key="item.title">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item v-for="child in item.subject" :key="child.title" link>
          <v-list-item-content>
            <v-list-item-title
              v-if="edit.id != child.id"
              v-text="child.title"
            ></v-list-item-title>
            <v-list-item-title v-if="edit.id == child.id">
              <v-text-field required v-model="child.title"></v-text-field>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-row>
              <v-col v-if="edit.id != child.id">
                <v-icon @click="edit.id = child.id">mdi-pencil</v-icon>
              </v-col>
              <v-col v-if="edit.id != child.id">
                <v-icon @click="deleteSubject(child.id)">mdi-delete</v-icon>
              </v-col>
              <v-col v-if="edit.id == child.id">
                <v-icon @click="editSubject(child)">mdi-check</v-icon>
              </v-col>
            </v-row>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-text-field
            label="주제 추가"
            required
            v-model="subject"
          ></v-text-field>
          <v-btn icon @click="createSubject(item.id, subject)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import api from "../../service/api";

export default {
  async created() {
    const result = await this.getGroup();
    this.items = result[0];
    console.log(this.items);
  },

  data: () => ({
    items: [],
    subject: "",
    edit: {
      id: 0,
      value: false
    }
  }),

  methods: {
    async getGroup() {
      const result = await api.project.list();
      return result.data;
    },

    editGroup: function(id) {
      this.editDialog = !this.editDialog;
      this.edit = this.todos.filter(a => a.id == id)[0];
    },

    async deleteSubject(id) {
      const select = confirm("Are you sure to delete todo?");
      if (select) {
        await api.subject.delete(id);
        this.$toasted.success("Delete Group", { duration: 2000 });
        location.reload();
      }
    },

    async createSubject(id, subject) {
      const body = {
        project: id,
        title: subject
      };
      await api.subject.post(body);
      this.subject = "";
      location.reload();
    },

    async createProject(body) {
      await api.project.post(body);
      location.reload();
    },

    async editSubject(body) {
      await api.subject.update(body);
      location.reload();
    }
  }
};
</script>
