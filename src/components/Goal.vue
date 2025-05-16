<template>
  <GoalModal v-if="showModal" @close="toggleModal" :currentWeight="currentWeight" />
  <div class="goals">
    <div class="goals-header">
      <h1>Goals</h1>
      <button class="addGoal" @click="toggleModal">Add new goal</button>
    </div>
    <div class="current-goals">
      <ul>
        <li v-if="goals.length === 0 || goals.goalCurrentlyActive === 0">
          <h3>No goals made yet.. Create a new one with our suggestion!</h3>
        </li>
        <li v-for="goal in goals" :key="goal.goal" class="active-goal">
          <h3>{{ goal.goal }}</h3>
          <p>Target: {{ goal.target }}</p>
          <p>End date: {{ goal.endDate }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import GoalModal from './GoalModal.vue'

export default {
  components: {
    GoalModal,
  },
  props: {
    currentWeight: {
      type: Number,
      default: null
    }
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

          if (data.goalsHistory && data.goalsHistory.length > 0) {
            const currentGoal = data.goalsHistory[data.goalsHistory.length - 1];

            this.goals = [{
              goal: currentGoal.goalName,
              target: currentGoal.targetWeight,
              endDate: new Date(currentGoal.targetDate).toLocaleDateString(),
            }];
          } else {
            this.goals = [];
          }

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
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  width: 50%;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.active-goal {
  padding: 10px 15px;
  margin: 8px 0;
  background-color: #f8f8f8;
  border-radius: 6px;
  border-left: 4px solid #f7c8f3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  align-items: center;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
}

.active-goal h3 {
  padding-left: 10px;
}

.active-goal p {
  padding-right: 10px;
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

.current-goals ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.current-goals li {
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


@media only screen and (orientation: portrait) {
  .goals {
    float: none;
    margin: 0 auto;
    width: 85%;
    margin-bottom: 5px;
  }
}
</style>