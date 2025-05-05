<template>
    <div class="login">
        <h2>Log in</h2>
        <form @submit.prevent="handleSubmit">
            <input type="email" required placeholder="Email" v-model="email">
            <input type="password" required placeholder="Password" v-model="password">
            <br>
            <p v-if="errMsg" style="color: red">{{ errMsg }}</p>
            <button @click="login">Log in</button>
        </form>
    </div>
</template>

<script>

export default {
  data() {
    return {
      email:  '',
      password: '',
      errMsg: '',
    };
  },

    methods: {
      async handleSubmit() {
        try {
          const res = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: this.email, password: this.password })
          });

        if (!res.ok) {
          const errorData = await res.json();
          this.errMsg = errorData.message;
        } else {
          this.$router.push('/');
        }
        } catch (error) {
          console.error('Login error:', error);
          alert('An error occurred during login.');
        }
      }
    }
};

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
  position: block;
  margin-left: 5%;
  margin-top: 1%;
  float: left;
  display: flex;
  flex-direction: column; 
  padding: 20px;
  background-color: white;
  width: 40%;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.login form {
  width: 90%;
  margin: 2% auto;
}

.login label {
  display: block;
  margin: 20px 0 10px;
}

.login input {
  width: 90%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
  outline: none;
  margin: 10px auto;
}

@media only screen and (orientation: portrait){
  .login{
    position: relative;
    float: none;
    margin: 0 auto;
    padding: 1%;
    width: 85%;
    margin: 0 auto;
    margin-bottom: 5px;
  }
}

</style>