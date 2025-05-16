<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form @submit.prevent>
                <h3>Weight</h3>
                    <div class="form-group">
                        <label>Set Weight (KG)</label>
                        <input v-model="weight" type="text" placeholder="Weight (KG)" required>
                    </div>
                    <div class="form-group">
                        <button @click="setWeight">Set Weight</button>
                    </div>
                <p v-if="msg" :class="{ 'success': !isError, 'error': isError }">{{ msg }}</p>                
            </form>

            <div class="weight-list">
                <ul v-if="weights && weights.length">
                    <li v-for="(weight, index) in weights" :key="index">
                        {{ weight.weight }}kg, {{ weight.date }}
                        <button class="delete" @click="deleteWeight(weight.id)">Delete</button>
                    </li>
                </ul>
                <p v-else>Loading members...</p>
            </div> 

        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            isError: false,
            weights: [],
            msg: '',
            weight: ''
        }
    },
    emits: ['weightUpdated'],
    methods: {
        closeModal() {
            this.$emit('close')
        },
        async getUserData() {
            const res = await fetch('http://localhost:5000/user', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();

                this.weight = data.weight

                if (data.weightHistory) {
                        this.weights = data.weightHistory.map(weight => {
                            return {
                                id: weight._id,
                                weight: weight.weight,
                                date: new Date(weight.date).toLocaleDateString()
                            };
                        });
            } else {
                console.error('Error fetching user data');
            }
            }
        },
        async deleteWeight(id) {

            const newWeight = this.weights[this.weights.length - 2].weight

            const res = await fetch('http://localhost:5000/delete-weight', {
                method: 'DELETE',
                headers: {
                   'Content-Type': 'application/json'
                },
                credentials: 'include', 
                body: JSON.stringify({ id }),
            });

            const data = await res.json();

            if (res.ok) {        
                await this.updateWeight(newWeight)
                await this.getUserData();
                this.$emit('deleteWeight');
                this.isError = false;
                this.msg = data.message;
            } else {
                this.isError = true;
                this.msg = data.message;
            }
        },

        async setWeight() {

            const res = await fetch('http://localhost:5000/set-weight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ weight: this.weight })
            });

            const data = await res.json();

            if (res.ok) {
                await this.getUserData();
                this.msg = data.message;
                this.isError = false;
                this.$emit("setWeight")
                this.$emit("weightUpdated", this.weight);
            } else {
                this.isError = true;
                this.msg = data.message
            }

        },

        async updateWeight(weight) {
            const res = await fetch('http://localhost:5000/update-weight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ weight: weight })
            });

            const data = await res.json();

            if (res.ok) {
                await this.getUserData();
                this.msg = data.message;
                this.isError = false;
                this.$emit("setWeight")
                this.$emit("weightUpdated", this.weight);
            } else {
                this.isError = true;
                this.msg = data.message
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

h3 {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
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

.weight-list {
    padding: 20px;
    border: 1px solid #c1c1c1;
    margin: 0 auto;
    border-radius: 10px;
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.weight-list ul {
    padding: 0;
    margin: 0;
}

.weight-list li {
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

.delete {
    background-color: #ff6b6b;
    color: white;
    border: none;
    cursor: pointer;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    margin: 5px;
}

.delete:hover {
    background-color: #ff5252;
}

.modal::-webkit-scrollbar {
  display: none;  
}

.weight-list::-webkit-scrollbar {
  display: none;  
}

.error {
    color: red;
    text-align: center;
}

.success {
    color: green;
    text-align: center;
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
    
    .weight-list {
        width: 90%;
        padding: 15px;
    }
    
    .weight-list li {
        flex-direction: column;
        text-align: center;
        padding: 15px 10px;
    }
    
    .delete {
        margin-top: 10px;
        padding: 8px 15px;
    }
    
    h3 {
        text-align: center;
    }
    
    .error, .success {
        margin: 10px 0;
    }
}

</style>

