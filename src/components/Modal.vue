<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form>
                <h1>Edit Profile</h1>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" v-model="email">
                </div>  
                <div class="form-group">
                    <label>Height (CM):</label>
                    <input type="number" v-model="height">
                </div>
            <div>
                <p v-if="msg">{{ msg }}</p>
                <button @click="handleSubmit">Submit</button>
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
            email: '',
            height: '',
            weight: '',
            name: '',
        }
    },

    methods: {
        closeModal() {
            this.$emit('close')
        },

        async handleSubmit(event) {

            event.preventDefault();
            this.errData = '';

                const res = await fetch('http://localhost:5000/update-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email: this.email, height: this.height, weight: this.weight })
                });
                if (res.ok) {
                    this.msg = ''
                    this.msg = 'Profile updated successfully!';

                    //Save today's date as the logged date in localStorage
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    localStorage.setItem('weightLoggedDate', today.toISOString());
                    this.closeModal();

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
                this.email = data.email;
                this.height = data.height;
                this.weight = data.weight;
                this.name = data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
            } else {
                console.error('Error fetching user data');
            }

        }
    },
    mounted() {
        this.getUserData();
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

@media screen and (max-width: 426px) {
    
    .modal {
        width: 80%;
    }
 
}



</style>

