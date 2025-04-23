<template>
    <Navigation />
    <Notification v-if="showNotification"/>
    <div class="dashboard">
        <h1>Dashboard</h1>
        <p>Your BMI is currently {{ bmi }}</p>
    </div>
    <Goals />
    <Foods />
    <Exercises />
</template>

<script>
import Navigation from '../components/Navigation.vue'
import Goals from '../components/Goal.vue'
import Foods from '../components/Food.vue'
import Exercises from '../components/Exercise.vue'
import Notification from '@/components/Notification.vue'

export default {
 components: {
    Navigation,
    Goals,
    Foods,
    Exercises,
    Notification,
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
        checkDay() {
            const today = new Date();
            const day = today.getDay();
            const firstDay = 1;

            if (day === firstDay) {
                this.showNotification = true;
            } else {
                this.showNotification = false;
            }

        }

    },
  data() {
    return {
      showModal: false,
      showNotification: false,
      bmi: ""
    }
  },
    created() {
        this.getUserData();
    },
    mounted() {
        this.checkDay();
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