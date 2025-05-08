<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form @submit.prevent="goalSubmission">
                <h1>Set a new goal</h1>
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
            targetDate: ''
        }
    },
    methods: {
        async goalSubmission(){
            try {
                const res = await fetch('http://localhost:5000/Goals',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        goalName: this.goalName,
                        targetWeight: this.targetWeight,
                        targetDate: this.targetDate
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    this.msg = errorData.message;
                } else {
                    this.msg = ''; 
                    this.msg = "Goal created. Good luck!";
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
    width: 400px;
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
  width: 300px;
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


</style>

