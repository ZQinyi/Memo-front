<template>
  <form @submit.prevent="login">
    <input type="text" v-model="username" placeholder="Username" required>
    <input type="password" v-model="password" placeholder="Password" required>
    <button type="submit">Login</button>
  </form>

  <p v-if="errorMessage" style="color: #980a0a;">{{ errorMessage }}</p>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    login() {
      const data = { username: this.username, password: this.password };

      axios.post('http://localhost:8080/login', data)
        .then(response => {
          const data = response.data; 
          if (data.code === 1) {
            console.log('Login successful:', data);
            sessionStorage.setItem('token', data.data);

            const base64Url = data.data.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            const userId = payload.id;

            this.$router.push({ name: 'notes', params: { userId: userId.toString() } }); // 使用用户ID进行跳转
          } else {
            this.errorMessage = 'Login failed: ' + (data.msg || 'Invalid Username or Password');
          }
        })
        .catch(error => {
          console.error('Login Error:', error);
          this.errorMessage = 'Login error: ' + error.message;
        });
    }
  }
};
</script>