<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form>
                <h1>Add to your Exercise Log</h1>
                <div class="form-group">
                    <label>Exercise Type</label>
                    <select name="exercises" id="exercises" v-model="exerciseName">
                         <option value="weightLifting">Weight Lifting</option>
                        <option value="Running">Running</option>
                        <option value="rockClimbing">Rock Climbing</option>
                        <option value="Swimming">Swimming</option>
                    </select>
                </div>
                <div class="form-group">
                    <label v-if="exerciseName !== 'Running'">Duration (minutes)</label>
                    <input type="number" v-model="exerciseDuration" v-if="exerciseName !== 'Running'">
                    <label v-if="exerciseName === 'Running'">Distance (KM)</label>
                    <input type="number" v-model="exerciseCalories" v-if="exerciseName === 'Running'">
                </div>


                <div class="form-group">
                    <button @click="handleSubmit">Add Exercise</button>
                </div>

                <div class="exercise-list">
                    <div class="exercise-item">
                        <ul>
                            <li v-for="(item, index) in exercises" :key="index">
                                <h3>{{ item.name }}</h3>
                                <p>{{ item.calories }} calories</p>
                                <button>Remove</button>
                            </li>
                        </ul>
                    </div>
                </div> 
            </form>
        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            errData: '',
            exerciseName: 'weightLifting',
            exerciseDuration: 0,
            exerciseCalories: 0,
            exercises: [
                { name: 'Weight Lifting', calories: 0 },
                { name: 'Running', calories: 0 },
                { name: 'Rock Climbing', calories: 0 },
                { name: 'Swimming', calories: 0 }
            ],
        }
    },
    methods: {
        closeModal() {
            this.$emit('close')
        }
    }
}

</script>

<style scoped>
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
    overflow-y: auto;
    width: 600px;
    padding: 20px;
    background: white;
    border-radius: 10px;
}

.backdrop {
    top: 0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
}

form {
    width: 500px;
    margin: 20px auto;
}

form h1 {
    display: block;
    text-align: center;
    padding-bottom: 10px;
}

.form-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
}

form select, input {
    width: 25%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #eee;
    outline: none;
    margin: 0;
}

form label {
    width: 25%;
    font-weight: 500;
}

form button {
    background-color: white;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    cursor: pointer;
    margin: 20px auto 0;
    display: block;
    margin-bottom: 20px;
    width: 30%;
    margin-left: auto;
    margin-right: auto;
}

form button:hover {
    background-color: #eee;
}

.exercise-list {
    padding: 20px;
    width: 90%;
    border: 1px solid #c1c1c1;
    margin: 0 auto;
    border-radius: 10px;
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.exercise-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.exercise-list li {
    padding: 10px 15px;
    margin: 8px 0;
    background-color: #f8f8f8;
    border-radius: 6px;
    border-left: 4px solid #f7c8f3;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    transition: background-color 0.3s;
}

.exercise-list li:hover {
    background-color: #f1f1f1;
    cursor: pointer;
}

.modal::-webkit-scrollbar {
  display: none;  
}

.exercise-list::-webkit-scrollbar {
  display: none;  
}



</style>

