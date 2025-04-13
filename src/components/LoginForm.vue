<template>
    <div class="login">
        <h2>Log in</h2>
        <form @submit.prevent="handleSubmit">
            <input type="email" required placeholder="email" v-model="email">
            <input type="password" required placeholder="password" v-model="password">
            <br>
            <p v-if="errMsg" style="color: red">{{ errMsg }}</p>
            <button @click="login">Log in</button>
        </form>
    </div>

    
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const router = useRouter();
const errMsg = ref("");

async function handleSubmit() {
  try {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    if (!res.ok) {
      const errorData = await res.json();
      errMsg.value = errorData.message;
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login.');
  }
}

</script>

<style scoped>

button {
  background-color: white;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  color: black;
  padding: 15px 20px;
  text-align: center;
  text-decoration: none;
  font-size: 15px;
  transition-duration: 0.4s;
  cursor: pointer;
}

button:hover {
  background-color: #eee;
}

.login {
  text-align: center;
  padding: 20px 0;
  background-color: white;
}

.login form {
  width: 300px;
  margin: 20px auto;
}

.login label {
  display: block;
  margin: 20px 0 10px;
}

.login input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
  outline: none;
  margin: 10px auto;
}

.login {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  width: 500px;
  margin: 20px 20px;
}

</style>