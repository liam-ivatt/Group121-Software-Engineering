<template>
    <WeightModal v-if="showModal" @close="toggleModal" 
    @deleteWeight="getUserData"
    @setWeight="getUserData"
    @weightUpdated="handleWeightUpdate"
     />
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <button class="set-weight" @click="toggleModal">Set Weight</button>
      </div>

        
        <div class="chart-container">
            <Line :data="data" :options="options" :height="200"/>
        </div>
        <p>Your BMI is currently {{ bmi }}</p>
    </div>
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

import WeightModal from '../components/WeightModal.vue'

export default {
 components: {
    WeightModal,
    Line,
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
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        handleWeightUpdate(newWeight) {

            this.$emit('weightUpdated', newWeight);
            
        },
    },
  data() {
    return {
      showModal: false,
      bmi: "",
      data: {
        labels: [],
        datasets: [
          {
            label: 'Weight History',
            backgroundColor: '#f7c8f3',
            borderColor: 'purple',
            borderWidth: 1,
            data: []
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
  emits: ['weightUpdated'],
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
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.dashboard h1 {
    text-align: left;
}

.dashboard-header {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 100%;
}

.dashboard-header h1 {
  margin: 0;
}

.set-weight {
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

.set-weight:hover {
  background-color: #eee;
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