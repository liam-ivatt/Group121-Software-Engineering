<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form @submit.prevent="handleSubmit">
                <h1>Create a new Group</h1>
                <div class="form-group">
                    <label>Group Name</label>
                    <input v-model="groupName" type="text" placeholder="Name" required>
                </div>  
            <div>
                <p v-if="msg">{{ msg }}</p>
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
            groupName: '',
            msg: ''
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        async handleSubmit() {
            const res = await fetch('http://localhost:5000/create-group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ groupName: this.groupName, groupId: this.groupId }),
            }); 

            const data = await res.json();

            if (res.ok) {
                this.msg = data.message;
            } else {
                const errData = await res.json();
                this.msg = errData.message;
            }
        },
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

h1 {
    width : 110%;
}


</style>

