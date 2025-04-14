<template>
    <Navigation />
    <div class="dashboard">
        <h1>Dashboard</h1>
        <p>Your BMI is currently {{ bmi }}</p>
    </div>
    <div @open="showModal">
        <Modal />
    </div>
    <Goals />
    <Foods />
</template>

<script>
import Navigation from '../components/Navigation.vue'
import Goals from '../components/Goal.vue'
import Foods from '../components/Food.vue'

export default {
 components: {
    Navigation,
    Goals,
    Foods,
 },
 methods: {
        toggleModal() {
            this.showModal = !this.showModal
        },
        async getUserData() {
            try {
                const response = await fetch('http://localhost:5000/user', {
                    method: 'GET',
                    credentials: 'include',  
                });
                if (response.ok) {
                    const data = await response.json();
                    this.bmi = data.bmi.toFixed(2);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },

    },
  data() {
    return {
      showModal: false,
      bmi: ""
    }
  },
    created() {
        this.getUserData();
    },
}

</script>

<style scoped>

.dashboard {
    padding: 20px;
    background-color: white;
    width: 50%;
    margin: 0 auto;
    margin-bottom: 20px;;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.dashboard h1 {
    text-align: left;
}

</style>