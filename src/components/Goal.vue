<template>
  <GoalModal v-if="showModal" @close="toggleModal" />
  <div class="goals">
    <div class="goals-header">
      <h1>Goals</h1>
      <button class="addGoal" @click="toggleModal">Add new goal</button>
    </div>
    <div class="current-goals">
        <ul>
          <li v-for="(goal, index) in goals" :key="index">
            <h3>{{ goal.goal }}</h3>
            <p>Target: {{ goal.target }}</p>
          </li>
        </ul>
    </div>
  </div>  
</template>

<script>
import GoalModal from './GoalModal.vue'

export default {
  components: { GoalModal,
  },
  data() {
    return {
      showModal: false,
      goals: [],
    }
  },
  created() {
    this.getUserData();
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
                    
                    this.goals = data.goalsHistory.map(goal => {
                        return {
                            goal: goal.goalName,
                            target: goal.targetWeight,
                        }
                    });

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
.goals {
  position: block;
  margin-left: 5%;
  float: left;
  display: flex;
  flex-direction: column; 
  padding: 20px;
  background-color: white;
  width: 40%;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  width: clamp(300px, 40%, 480px);
  max-height: 60vh;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.goals-header {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 100%;
  margin-bottom: 20px; 
}

h1 {
  margin: 0; 
}

.current-goals {
    float: left;
}
.current-goals ul{
  list-style: none;
  margin: 0;
  padding: 0;
}

.current-goals li{
  display: flex;
  justify-content: space-between;
  padding: 6px 0;  
}


.addGoal {
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

.addGoal:hover {
  background-color: #eee;
}

@media only screen and (orientation: portrait){
  .goals{
    float: none;
    margin: 0 auto;
    width: 85%;
    margin-bottom: 5px;
  }
}

</style>