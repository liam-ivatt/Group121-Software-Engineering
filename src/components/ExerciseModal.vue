<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form @submit.prevent="handleSubmit">
                <h1>Add to your Exercise Log</h1>
                <div class="form-group">
                    <label>Exercise Type</label>
                    <select name="exercises" id="exercises" v-model="exerciseName">
                        <option value="Weight Lifting">Weight Lifting</option>
                        <option value="Running">Running</option>
                        <option value="Rock Climbing">Rock Climbing</option>
                        <option value="Swimming">Swimming</option>
                    </select>
                </div>
                <div class="form-group">
                    <label v-if="exerciseName !== 'Running'">Duration (minutes)</label>
                    <input type="number" v-model="exerciseStat" v-if="exerciseName !== 'Running'">
                    <label v-if="exerciseName === 'Running'">Distance (KM)</label>
                    <input type="number" v-model="exerciseStat" v-if="exerciseName === 'Running'">
                </div>

                <p v-if="msg">{{ msg }}</p>


                <div class="form-group">
                    <button>Add Exercise</button>
                </div>
            </form>

            <div class="exercise-list">
                <ul>
                    <li v-for="(item, index) in exercises" :key="index">
                        <h3>{{ item.name }}</h3>
                        <p v-if="item.name === 'Running'">Distance: {{ item.stat }}</p>
                        <p v-else>Duration: {{ item.stat }}</p>
                        <p>{{ item.date }}</p>
                        <button @click="deleteExercise(item.id)" class="add-exercise">Remove</button>
                    </li>
                </ul>
            </div> 
        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            errData: '',
            exerciseName: 'Weight Lifting',
            exerciseStat: 0,
            exercises: [],
            msg: ''
        }
    },
    methods: {
        closeModal() {
            this.$emit('close')
        },
        async handleSubmit() {
            
            this.errData = '';

            const res = await fetch('http://localhost:5000/add-exercise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ exercise: this.exerciseName, exerciseStat: this.exerciseStat, date: new Date().toLocaleDateString('en-GB') }),
            });
 
            if (res.ok) {
                    this.msg = ''
                    this.msg = 'Exercise added successfully!';
                    await this.getUserData();
                } else { 
                    const errorData = await res.json();
                    this.msg = errorData.message; 
            }
        
        },
        async getUserData() {
            const res = await fetch('http://localhost:5000/user', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();

                console.log(data.exerciseHistory)

                if (data.exerciseHistory) {
                        this.exercises = data.exerciseHistory.map(exercise => {
                            return {
                                id: exercise._id,
                                name: exercise.exercise.charAt(0).toUpperCase() + exercise.exercise.slice(1),
                                stat: exercise.exerciseStat,
                                date: exercise.date,
                            };
                        });
            } else {
                console.error('Error fetching user data');
            }
            }
        },
        async deleteExercise(id) {
            const res = await fetch('http://localhost:5000/delete-exercise', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                await this.getUserData();
                this.$emit('deleteExercise')
            } else {
                console.error('Error deleting exercise');
            }
        }
    },
    mounted() {
        this.getUserData();
    },
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
    width: 30%;
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
    display: block;
}

form button:hover {
    background-color: #eee;
}

.exercise-list {
    padding: 20px;
    border: 1px solid #c1c1c1;
    margin: 0 auto;
    border-radius: 10px;
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.exercise-list ul {
    padding: 0;
    margin: 0;
}

.exercise-list li {
    padding: 10px 15px;
    margin: 8px 0;
    background-color: #f8f8f8;
    border-radius: 6px;
    border-left: 4px solid #f7c8f3;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    align-items: center;
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    transition: background-color 0.3s;
}

.modal::-webkit-scrollbar {
  display: none;  
}

.exercise-list::-webkit-scrollbar {
  display: none;  
}

.add-exercise {
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

@media screen and (max-width: 426px) {
    .modal {
        width: 80%;
    }
    
    form {
        width: 100%;
        margin: 10px auto;
    }
    
    .form-group {
        flex-direction: column;
        gap: 10px;
    }
    
    form label {
        width: 100%;
        text-align: center;
        margin-bottom: 5px;
    }
    
    form select, input {
        width: 80%;
    }
    
    form button {
        margin: 0 auto;
    }
    
    .exercise-list {
        width: 90%;
        padding: 15px;
        margin: 0 auto;
    }
    
    .exercise-list li {
        flex-direction: column;
        text-align: center;
        padding: 15px 10px;
    }
    
    .exercise-list li h3, 
    .exercise-list li p {
        margin: 5px 0;
    }
    
    .add-exercise {
        margin-top: 10px;
        padding: 8px 15px;
        width: auto;
    }
    
    h1, h3 {
        text-align: center;
    }
    
    p {
        text-align: center;
    }
}


</style>

