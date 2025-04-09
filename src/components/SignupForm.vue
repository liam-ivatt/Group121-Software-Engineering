<template>
    <div class="sign">
        <h2>Sign up</h2>
        <form @submit.prevent="handleSubmit">
            <input type="text" required placeholder="first name" v-model="firstname">
            <input type="text" required placeholder="last name" v-model="lastname">
            <input type="number" required placeholder="height" v-model="height">
            <input type="number" required placeholder="weight" v-model="weight">
            <input type="email" required placeholder="email" v-model="email">
            <input type="password" required placeholder="password" v-model="password">
            <br>
            <p v-if="errMsg" style="color: red;">{{ errMsg }}</p>
            <p v-if="msg" style="color: green;">{{ msg }}</p>
            <button @click="register">Sign up</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter();

const firstname = ref("");
const lastname = ref("");
const height = ref("");
const weight = ref("");
const email = ref("");
const password = ref("");
const errMsg = ref("");
const msg = ref("");

async function handleSubmit() {
  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Send session cookie with request
      body: JSON.stringify({
        firstName: firstname.value,
        lastName: lastname.value,
        email: email.value,
        password: password.value,
        height: height.value,
        weight: weight.value
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      errMsg.value = errorData.message;
    } else {
      // Redirect to dashboard after successful registration
      msg.value = "Registration successful! Please log in.";
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration.');
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

.sign {
  text-align: center;
  padding: 20px 0;
  background-color: white;
}

.sign form {
  width: 300px;
  margin: 20px auto;
}

.sign label {
  display: block;
  margin: 20px 0 10px;
}

.sign input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
  outline: none;
  margin: 10px auto;
  
}

.sign {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  width: 500px;
  margin: 20px 20px;
}


</style>