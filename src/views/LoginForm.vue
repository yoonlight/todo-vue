<template>
  <v-app>
    <v-main class="light-blue lighten-5">
      <v-container>
        <v-card>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="login.username"
                :counter="20"
                :rules="nameRules"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                :type="show ? 'text' : 'password'"
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
                Login
              </v-btn>
              <v-btn color="success" class="mr-4" @click="sessionCheck">
                Check
              </v-btn>
              <v-btn color="success" @click="register">
                Register
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    show: false,
    valid: true,
    login: {
      username: "",
      password: ""
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 20) || "Name must be less than 20 characters"
    ],
    checkbox: false
  }),

  methods: {
    async validate(val) {
      if (this.$refs.form.validate()) {
        await this.axios
          .post(`api/auth/login`, val)
          .catch(error => {
            if (error)
              this.$toasted.error(error.response.data.message, {
                duration: 2000
              });
          })
          .then(result => {
            if (result) {
              this.$toasted.success(result.data.message, { duration: 2000 });
              let token = result.data.token;
              localStorage.setItem("user", token);
              this.$router.push("/");
            }
          });
      }
    },

    async sessionCheck() {
      await this.axios
        .get("api/auth")
        .then(result => this.$toasted.success(result.data, { duration: 2000 }));
    },

    async jwtCheck() {
      await this.axios
        .get("api/auth/profile")
        .then(result => this.$toasted.success(result.data, { duration: 2000 }));
    },

    register() {
      this.$router.push("/register");
    }
  }
};
</script>
