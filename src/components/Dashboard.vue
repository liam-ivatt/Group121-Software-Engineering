<template>
  <WeightModal v-if="showModal" @close="toggleModal" @deleteWeight="getUserData()" @setWeight="getUserData()"
    @weightUpdated="handleWeightUpdate()" />
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <button class="set-weight" @click="toggleModal">Set Weight</button>
    </div>
    <div class="chart-container">
      <Line :data="data" :options="options" :height="200" />
    </div>
    <h3>BMI</h3>
    <p>Your BMI is currently {{ bmi }}, which is classified as being {{ classification }}</p>
    <p>{{ recommendedBMI }}</p>
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
        this.bmiClassification(this.bmi)
      } catch (error) {
        console.error('Error:', error);
      }
    },
    bmiClassification(bmi) {

      console.log("test", bmi)

      switch (true) {
        case bmi < 18.5:
          this.classification = 'Underweight';
          break;
        case bmi >= 18.5 && bmi < 25:
          this.classification = 'Normal Weight';
          break;
        case bmi >= 25 && bmi < 30:
          this.classification = 'Overweight';
          break;
        case bmi >= 30:
          this.classification = 'Obese';
          break;
        default:
          this.classification = 'Unknown';
      }

      switch (this.classification) {
        case 'Underweight':
          this.recommendedBMI = `You need to gain ${(18.5 - bmi).toFixed(1)} BMI points to reach Normal Weight`;
          break;
        case 'Normal Weight':
          if (bmi < 21.75) {
            this.recommendedBMI = `You are ${(25 - bmi).toFixed(1)} BMI points away from being Overweight`;
          } else {
            this.recommendedBMI = `You are ${(bmi - 18.5).toFixed(1)} BMI points above being Underweight`;
          }
          break;
        case 'Overweight':
          this.recommendedBMI = `You need to lose ${(bmi - 24.9).toFixed(1)} BMI points to reach Normal Weight`;
          break;
        case 'Obese':
          this.recommendedBMI = `You need to lose ${(bmi - 29.9).toFixed(1)} BMI points to reach Overweight`;
          break;
        default:
          this.recommendedBMI = 'Unable to calculate BMI recommendation';
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
      classification: '',
      recommendedBMI: '',
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
  async created() {
    await this.getUserData();
    this.bmiClassification(this.bmi);
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
  text-align: center;
}

h3 {
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
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


@media only screen and (orientation: portrait) {
  .dashboard {
    float: none;
    margin: 0 auto;
    width: 85%;
    margin-bottom: 5px;
  }
}
</style>