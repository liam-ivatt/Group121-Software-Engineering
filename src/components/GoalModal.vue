<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form @submit.prevent="goalSubmission">
                <h1>Set a new goal</h1>
                <button type="button" @click="goalSuggestion">Suggest Goal!</button>
                <div class="form-group">
                    <label>Name</label>
                    <input v-model="goalName" type="text" placeholder="Name" required>
                </div>  
                <div class="form-group">
                    <label>Goal Weight (KG):</label>
                    <input v-model="targetWeight" type="number" placeholder="Weight" required>
                    <label>Acheivement Date:</label>
                    <input v-model="targetDate" type="date" placeholder="Date" required>
                </div>
            <div>
                <p v-if="msg" >{{msg}}</p>
                <button type="submit">Submit</button>
            </div>
            </form>

            <div class="goal-list">
                <ul>
                    <li v-for="(item, index) in goals" :key="index">
                        <h3>{{ item.goalName }}</h3>
                        <p>Target Weight = {{ item.targetWeight }}</p>
                        <p>{{ item.targetDate }}</p>
                        <button @click="deleteGoal(item.id)" class="add-exercise">Remove</button>
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
            msg: '',
            goalName: '',
            targetWeight: '',
            targetDate: '',
            goals: [],
        }
    },
    props: {
    currentWeight: {
      type: Number,
      default: null
    }
    },
    methods: {
        async getUserData() {
            const res = await fetch('http://localhost:5000/user', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();

                if (data.goalsHistory) {
                        this.goals = data.goalsHistory.map(goal => {
                            return {
                                id: goal._id,
                                goalName: goal.goalName,
                                targetWeight: goal.targetWeight,
                                targetDate: new Date(goal.targetDate).toLocaleDateString(),
                            };
                        });
                console.log(data.goalsHistory);
            } else {
                console.error('Error fetching user data');
            }
            }
        },

        async goalSubmission(){
            try{
                const res = await fetch('http://localhost:5000/create-goal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ goalName: this.goalName, targetWeight: this.targetWeight, targetDate: this.targetDate }),
                });

                if (!res.ok){
                    const errorData = await res.json();
                    this.msg = errorData.message;
                } 
                else{
                    this.msg = ''; 
                    this.msg = "Goal created. Good luck!";
                    await this.getUserData();

                    //clear form
                    this.goalName = '';
                    this.targetWeight = '';
                    this.targetDate = '';
                }
            } catch (error) {
                console.error('Goal Creation Error: ', error);
                alert('An error occurred during the creation of your goal.');
            }
        },

        async deleteGoal(id) {
            const res = await fetch('http://localhost:5000/delete-goal', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                await this.getUserData(); 
            } else {
                console.error('Error deleting goal');
            }
        },

        async goalSuggestion(){
            try{
                const res = await fetch('http://localhost:5000/suggest-goal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    this.msg = 'Suggested goal loaded. You can now review and submit it.';

                    const suggestedG = data.suggestedGoal;
                    this.goalName = suggestedG.goalName;
                    this.targetWeight = suggestedG.targetWeight;
                    this.targetDate = suggestedG.targetDate;

                } else { 
                    const errorData = await res.json();
                    this.msg = errorData.message; 
                }
            } catch (error) {
                console.error('Goal Suggestion Error:', error);
                alert('An error occurred during the creation of your suggested goal.');
            }
        },

        closeModal() {
            this.$emit('close')
            location.reload();
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

label {
  display: block;
  margin: 20px 0 10px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
  outline: none;
  margin: 10px auto;
  
}

form h1 {
    display: block;
    text-align: center;
    padding-bottom: 10px;
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
}

form button:hover {
    background-color: #eee;
}

.goal-list {
    padding: 20px;
    border: 1px solid #c1c1c1;
    margin: 0 auto;
    border-radius: 10px;
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.goal-list ul {
    padding: 0;
    margin: 0;
}

.goal-list li {
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

.goal-list::-webkit-scrollbar {
  display: none;  
}

.add-goal {
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

</style>

