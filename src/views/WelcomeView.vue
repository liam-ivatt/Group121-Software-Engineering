<template>
  <div class="title">
    <h1>Welcome to the hub of self-improvement</h1>
  </div>
  <div class="wrapper">
    <LoginForm />
    <SignupForm />
  </div>

</template>

<script>
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'

export default {
  components: { LoginForm, SignupForm },
}
</script>

<style scoped>
.title {
  display: inline-block;
  text-align: center;
  background-color: white;
  width: 100%;
  border-radius: 10px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

h1 {}

.wrapper {
  display: block;
  justify-content: center;
  align-items: flex-start;
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

@media only screen and (orientation: portrait) {
  .wrapper {
    display: block;
    justify-content: center;
    align-items: flex-start;
    ;
  }

  .title {
    margin: 0px;
    width: 98%;
    margin-bottom: 5px;
    border-radius: 0px;
    padding: 1%;
  }

  h1 {
    margin: 4%;
  }
}
</style>
