<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <h1>Your Food Diary</h1>
            <div class="quickAddSection">
                <h2>Quick Add</h2>
                <div class="commonFoods">
                    <button v-for="(food, index) in commonFoods" :key="index" class="commonFoodBtn"
                        @click="selectCommonFood(food)">
                        {{ food.name }} ({{ food.calories }} cal)
                    </button>
                </div>
            </div>
            <div class="customAddSection">
                <h2>Add Custom Food</h2>
                <form @submit.prevent="handleAddCustomFood">
                    <div class="formField">
                        <label for="foodName">Food Name</label>
                        <input type="text" id="foodName" v-model.trim="newFood.name" placeholder="Enter food name"
                            required>
                    </div>
                    <div class="formField">
                        <label for="calories">Calories</label>
                        <input type="number" id="calories" v-model.number="newFood.calories"
                            placeholder="Enter calories" min="0" required>
                    </div>
                    <div class="messageArea">
                        <p v-if="message" :class="messageType">{{ message }}</p>
                    </div>
                    <div class="buttonGroup">
                        <button type="submit">Add Food</button>
                        <button type="button" @click="closeModal">Close</button>
                    </div>
                </form>
            </div>

            <div class="todayFoods">
                <h2>Today's Foods</h2>
                <div class="foodList">
                    <div v-if="todayMeals.length > 0" class="foodItems">
                        <div v-for="(meal, index) in todayMeals" :key="index" class="foodItem">
                            <div class="foodInfo">
                                <h3>{{ meal.name }}</h3>
                                <p>{{ meal.calories }} calories</p>
                            </div>
                            <button class="deleteBtn" @click="deleteMeal(meal._id)">Remove</button>
                        </div>
                        <div class="calorieTotal">
                            <p>Total calories today: <strong>{{ totalCalories }}</strong></p>
                        </div>
                    </div>
                    <div v-else>
                        <p>No foods logged today</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newFood: {
                name: '',
                calories: null
            },
            todayMeals: [],
            commonFoods: [
                { name: 'Apple', calories: 95 },
                { name: 'Banana', calories: 105 },
                { name: 'Chicken Breast(100g)', calories: 165 },
                { name: 'Egg', calories: 78 },
                { name: 'Yogurt(100g)', calories: 59 },
                { name: 'Oatmeal(200g)', calories: 136 },
                { name: 'Brown Rice(1cup)', calories: 218 },
                { name: 'Salmon(100g)', calories: 208 },
                { name: 'Avocado', calories: 240 }
            ],
            message: '',
            messageType: '',
            totalCalories: 0
        }
    },
    mounted() {
        this.fetchTodayMeals();
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        selectCommonFood(food) {
            this.newFood.name = food.name;
            this.newFood.calories = food.calories;
        },
        async handleAddCustomFood() {
            this.message = '';

            try {
                const response = await fetch('http://localhost:5000/meals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        name: this.newFood.name,
                        calories: this.newFood.calories
                    })
                });

                if (response.ok) {
                    this.message = 'Food added successfully!';
                    this.messageType = 'success';

                    this.newFood.name = '';
                    this.newFood.calories = null;

                    await this.fetchTodayMeals();

                    this.$emit('foodUpdated');
                } else {
                    const errorData = await response.json();
                    this.message = errorData.message || 'Failed to add food';
                    this.messageType = 'error';
                }
            } catch (error) {
                console.error('Error adding food:', error);
                this.message = 'An error occurred. Please try again.';
                this.messageType = 'error';
            }
        },
        async fetchTodayMeals() {
            try {
                const response = await fetch('http://localhost:5000/meals/today', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    this.todayMeals = data.meals;
                    this.totalCalories = data.totalCals;
                } else {
                    console.error('Error fetching today\'s meals');
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
                    await this.fetchTodayMeals();
                    this.$emit('foodUpdated');
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
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
    overflow-y: auto;
    width: 90%;
    max-width: 600px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    z-index: 1001;
    box-sizing: border-box;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    margin: 10px 0;
}

.quickAddSection,
.customAddSection,
.todayFoods {
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-sizing: border-box;
    width: 100%;
}

.commonFoods {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.commonFoodBtn {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.formField {
    margin-bottom: 15px;
    width: 100%;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-sizing: border-box;
}

.buttonGroup {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

button {
    background-color: white;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    padding: 10px 15px;
    cursor: pointer;
}

button:hover {
    background-color: #eee;
}

.foodList {
    max-height: 300px;
    overflow-y: auto;
    margin-top: 10px;
    width: 100%;
}

.foodItem {
    padding: 10px;
    margin-bottom: 8px;
    background-color: #f8f8f8;
    border-radius: 6px;
    border-left: 4px solid #f7c8f3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}

.foodInfo {
    flex: 1;
    overflow: hidden;
}

.foodInfo h3 {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.foodInfo p {
    margin: 4px 0 0;
    color: #666;
}

.deleteBtn {
    flex-shrink: 0;
    margin-left: 8px;
}

.calorieTotal {
    margin-top: 15px;
    padding: 10px;
    text-align: right;
    border-top: 1px solid #eee;
    width: 100%;
    box-sizing: border-box;
}

.messageArea {
    height: 24px;
    margin-bottom: 10px;
    width: 100%;
}

.success {
    color: green;
}

.error {
    color: red;
}

.modal::-webkit-scrollbar {
    display: none;
}

.modal {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.foodList::-webkit-scrollbar {
    display: none;
}

.foodList {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

form {
    width: 100%;
}
</style>