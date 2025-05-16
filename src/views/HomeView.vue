<template>
    <Navigation />
    <Notification v-if="showNotification"/>
    <Dashboard @weightUpdated="handleWeightUpdate"/>
    <Goals :currentWeight="currentWeight"/>
    <Foods />
    <Exercises />
</template>

<script>
// Component imports
import Navigation from '../components/Navigation.vue'
import Goals from '../components/Goal.vue'
import Foods from '../components/Food.vue'
import Exercises from '../components/Exercise.vue'
import Notification from '../components/Notification.vue'
import Dashboard from '../components/Dashboard.vue'

export default {
 components: {
    Navigation,
    Goals,
    Foods,
    Exercises,
    Notification,
    Dashboard,
 },
 methods: {
    toggleModal() {
            this.showModal = !this.showModal
        },
        async getUserData() {
            try {
                const res = await fetch('http://localhost:5000/user', {
                    method: 'GET',
                    credentials: 'include',  
                });
                if (res.ok) {
                    const data = await res.json();
                    this.userData = data;
                    this.bmi = data.bmi.toFixed(2);

                    if (data.weightHistory) {
                        this.data = {
                        labels: data.weightHistory.map(entry => new Date(entry.date).toLocaleDateString()),
                        datasets: [
                            {
                                label: 'Weight History',
                                data: data.weightHistory.map(entry => entry.weight)
                            }
                            ]
                        };
                    } 
                    this.checkDay();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },

        checkDay() {
            if (!this.userData) {
                return;
            }

            const weightLoggedDate = localStorage.getItem('weightLoggedDate');

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

            if (weightLoggedDate && new Date (weightLoggedDate).getTime() === today.getTime()){
                console.log("Weight already logged for today.");
                this.showNotification = false;
                return;
            }

            if (this.userData.goalCurrentlyActive == 1 && this.userData.goalsHistory.length > 0){
            const activeGoal = this.userData.goalsHistory[this.userData.goalsHistory.length - 1];
                
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
            const targetDate = new Date(activeGoal.targetDate);
            targetDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
            console.log("Target date: " + targetDate);
            console.log("Today: " + today);

            if (targetDate > today){
                if (activeGoal.targetWeight >= this.userData.weight){
                    console.log("You have reached your goal!");
                } else {
                    console.log("You have not reached your goal yet.");
                    this.showNotification = true;

                }
            } else {
                console.log("You have not reached your goal in time.");
            }
                    
            } else {
                this.showNotification = false;
            }
        },
        handleWeightUpdate(newWeight) {
            this.currentWeight = newWeight;
            this.getUserData();
        },
    },

  data() {
    return {
      showModal: false,
      showNotification: false,
      currentWeight: null,
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

@media only screen and (orientation: portrait){
  .dashboard{
    float: none;
    margin: 0 auto;
    width: 85%;
    margin-bottom: 5px;
   }
  }

</style>