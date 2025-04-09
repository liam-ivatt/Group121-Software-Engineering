<template>
  <h1>Welcome to the hub of self-improvement</h1>
  <div class="wrapper">
    <LoginForm />
    <SignupForm />
  </div>
  
</template>

<script>
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'

export default {
  components: {LoginForm, SignupForm},
}
</script>

<style scoped>

h1 {
  padding: 20px;
  position: relative;
  top: 20px;
  display: inline;
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.wrapper {
  padding-top: 30px;
  display: flex;
  justify-content: center;
}

button {
  background-color: white;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  color: black;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  transition-duration: 0.4s;
  cursor: pointer;
}

button:hover {
  background-color: #eee;
}


</style>
