<template>
    <Modal v-if="showModal" @close="toggleModal" />
    <div>
        <h1 class="header">Welcome, {{ firstName }}</h1>
        <button class="profile" @click="toggleModal">Profile</button>
        <button class="logout" @click="handleLogout">Log out</button>
    </div>
    
</template>

<script>
import { ref } from 'vue'
import Modal from './Modal.vue'



export default {
  components: { Modal,
  },
  data() {
    return {
      showModal: false,
      firstName: "",
    }
  },
  created() {
    this.getUserData();
  },
  methods: {
        toggleModal() {
            this.showModal = !this.showModal
        },
        async handleLogout() {
            const res = await fetch('http://localhost:5000/logout', { 
                method: 'POST',
                credentials: 'include'
             });
            if (res.ok) {
                this.$router.push('/welcome')
            }
        },
        async getUserData() {
            try {
                const response = await fetch('http://localhost:5000/user', {
                    method: 'GET',
                    credentials: 'include',  
                });
                if (response.ok) {
                    const data = await response.json();
                    this.firstName = data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
    },
}

</script>

<style scoped>

.header {
    margin-right: auto;
}

div {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: white;
    width: 50%;
    margin: 0 auto;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.logout {
    background-color: white;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    color: black;
    background-color: #fc4747;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    cursor: pointer;
    margin-left: 10px;
    float: right;
}

.logout:hover {
    background-color: #eee;
}

.profile {
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

.profile:hover {
    background-color: #eee;
}

</style>