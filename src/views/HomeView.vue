<template>
    <Navigation />
    <Notification v-if="showNotification"/>
    <div class="dashboard">
        <h1>Dashboard</h1>
        <div class="chart-container">
            <Line :data="data" :options="options" :height="200"/>
        </div>
        <p>Your BMI is currently {{ bmi }}</p>
    </div>
    <Goals />
    <Foods />
    <Exercises />
</template>

<script>

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Component imports
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
    Line
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
        }
    },

  data() {
    return {
      showModal: false,
      showNotification: false,
      bmi: "",
      data: {
        labels: [], // This will be dynamically updated in getUserData()
        datasets: [
          {
            label: 'Weight History',
            backgroundColor: '#f7c8f3',
            borderColor: 'purple',
            borderWidth: 1,
            data: [] // This will be dynamically updated in getUserData()
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 50,
                right: 50
            }
        },
      }    
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