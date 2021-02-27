<template>
  <v-container>
    <v-responsive height="85vh" class="d-flex align-center text-center pa-2">
      <v-card>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="login.username"
              :counter="10"
              :rules="nameRules"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="login.password"
              label="Password"
              required
            ></v-text-field>
            <v-checkbox
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            ></v-checkbox>
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate(login)"
            >
              Validate
            </v-btn>
            <v-btn color="error" class="mr-4" @click="reset">
              Reset Form
            </v-btn>
            <v-btn color="warning" class="mr-4" @click="resetValidation">
              Reset Validation
            </v-btn>
            <v-btn color="error" class="mr-4" @click="logout">
              LogOut
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    login: {
      username: "",
      password: ""
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 10) || "Name must be less than 10 characters"
    ],
    checkbox: false
  }),

  methods: {
    async validate(val) {
      if (this.$refs.form.validate()) {
        await this.axios
          .post(`api/auth/login`, val)
          .then(result => alert(result.data.message));
      }
    },

    reset() {
      this.$refs.form.reset();
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    async logout() {
      await this.axios
        .get("api/auth/logout")
        .then(result => console.log(result));
    }
  }
};
</script>
