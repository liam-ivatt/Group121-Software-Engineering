<template>
  <FoodModal v-if="showModal" @close="toggleModal" @foodUpdated="fetchMeals" />
  <div class="foodContainer">
    <div class="headerSection">
      <h1>Diet</h1>
      <button class="addFood" @click="toggleModal">Add new food</button>
    </div>
    <div class="todaySummary">
      <h2>Today's Summary</h2>
      <div class="summaryBox">
        <p>Meals recorded today: {{ todayCount }}</p>
        <p>Total calories: {{ todayCalories }}</p>
      </div>
    </div>
    <div class="foodHistory">
      <h2>Food History</h2>
      <div class="foodList">
        <div v-if="meals.length > 0" class="foodItems">
          <div v-for="(meal, index) in meals" :key="index" class="foodItem">
            <div class="foodInfo">
              <h3>{{ meal.name }}</h3>
              <p>{{ meal.calories }} calories</p>
              <p class="dateInfo">{{ formatDate(meal.creationDate) }}</p>
            </div>
            <button class="deleteButton" @click="deleteMeal(meal._id)">Delete</button>
          </div>
        </div>
        <div v-else class="noFood">
          <h3>No meals recorded yet.</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FoodModal from './FoodModal.vue'

export default {
  components: { FoodModal },
  data() {
    return {
      showModal: false,
      meals: [],
      todayCount: 0,
      todayCalories: 0
    }
  },
  created() {
    this.fetchMeals();
    this.fetchTodayStats();
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    },
    async fetchMeals() {
      try {
        const response = await fetch('http://localhost:5000/meals', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          this.meals = data;
        } else {
          console.error('Error fetching meals');
        }
        this.fetchTodayStats();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async fetchTodayStats() {
      try {
        const response = await fetch('http://localhost:5000/meals/today', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          this.todayCount = data.count;
          this.todayCalories = data.totalCals;
        } else {
          console.error('Error fetching today\'s meal stats');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async deleteMeal(id) {
      try {
        const response = await fetch(`http://localhost:5000/meals/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          this.meals = this.meals.filter(meal => meal._id !== id);
          this.fetchTodayStats();
        } else {
          console.error('Error deleting meal');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>

<style scoped>
.foodContainer {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  width: 45%;
  margin: 0 auto;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.headerSection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

h1,
h2 {
  margin: 0;
}

.todaySummary {
  margin-bottom: 20px;
}

.summaryBox {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.foodHistory {
  margin-top: 10px;
}

.foodList {
  margin-top: 15px;
  max-height: 350px;
  overflow-y: auto;
}

.foodItem {
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
  border-left: 4px solid #f7c8f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.foodInfo h3 {
  margin: 0;
  font-size: 18px;
}

.foodInfo p {
  margin: 5px 0;
  color: #666;
}

.dateInfo {
  font-size: 0.8em;
  color: #888;
}

.addFood {
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

.addFood:hover {
  background-color: #eee;
}

.deleteButton {
  background-color: white;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition-duration: 0.4s;
}

.deleteButton:hover {
  background-color: #eee;
}

@media only screen and (orientation: portrait) {
  .foodContainer {
    float: none;
    margin: 0 auto;
    width: 85%;
    margin-bottom: 5px;
  }
}
</style>