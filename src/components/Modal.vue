<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form>
                <h1>Edit Profile</h1>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email">
                </div>  
                <div class="form-group">
                    <label>Height (CM):</label>
                    <input type="number">
                    <label>Weight (KG):</label>
                    <input type="number">
                </div>
            <div>
                <p v-if="errData" >{{errData}}</p>
                <button @click="handleSubmit">Submit</button>
            </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

const errData = ref("");
const email = ref("");
const height = ref("");
const weight = ref("");

async function handleSubmit() {

    event.preventDefault();

    try {
        console.log('test');
        const res = await fetch('http://localhost:5000/api/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: email.value, height: height.value, weight: weight.value })
        });

        if (!res.ok) {
            const errorData = await res.json();
            errData.value = errorData.message;
        } else {  
        }
    } catch (error) {
        console.error('Profile update error:', error);
        alert('An error occurred during profile update.');
    }
}

export default {
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

