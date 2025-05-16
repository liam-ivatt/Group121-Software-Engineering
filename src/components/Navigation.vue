<template>
    <Modal v-if="showModal" @close="toggleModal" />
    <div class="mobile">
        <h1 class="header">Welcome, {{ firstName }}</h1>
        <button class="Home" @click="$router.push('/')">Home</button>
        <button class="group" @click="$router.push('/group')">Groups</button>
        <button class="profile" @click="toggleModal">Profile</button>
        <button class="logout" @click="handleLogout">Log Out</button>
    </div>
    
</template>

<script>
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
    left: 0px;
    right: 0px;
    margin-bottom: 20px;
    border-radius: 10px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.Home {
    background-color: white;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    color: black;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    margin-right: 10px;
    cursor: pointer;
}

.Home:hover {
    background-color: #eee;
}


.logout {
    background-color: #ff6b6b;
    color: white;
    border: none;
    cursor: pointer;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    margin-left: 10px;
}

.logout:hover {
    background-color: #ff5252;
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
    margin-left: 10px;

}

.profile:hover {
    background-color: #eee;
}

.group {
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

.group:hover {
    background-color: #eee;
}

@media screen and (max-width: 426px) {
    
    .mobile {
        display: block;
    }
 
}

</style>