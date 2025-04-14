<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form>
                <h1>Add to your Diet Log</h1>
                <div class="food-list">
                    <div class="food-item">
                        <ul>
                            <li v-for="(item, index) in foodItems" :key="index">
                                <h3>{{ item.name }}</h3>
                                <p>{{ item.calories }} calories</p>
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
            foodItems: [
                {
                    name: 'Test Food',
                    calories: 100,
                },
                {
                    name: 'Another Food',
                    calories: 200,
                },
                {
                    name: 'More Food',
                    calories: 300,
                },
                {
                    name: 'Food Item 4',
                    calories: 400,
                },
                {
                    name: 'Food Item 5',
                    calories: 500,
                },
                {
                    name: 'Food Item 6',
                    calories: 600,
                },
                {
                    name: 'Food Item 7',
                    calories: 700,
                },
                {
                    name: 'Food Item 8',
                    calories: 800,
                },
                {
                    name: 'Food Item 9',
                    calories: 900,
                },
                {
                    name: 'Food Item 10',
                    calories: 1000,
                },
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

.food-list {
    padding: 20px;
    width: 90%;
    border: 1px solid #c1c1c1;
    margin: 0 auto;
    border-radius: 10px;
    height: 300px; 
    overflow-y: auto; 
    overflow-x: hidden; 

}

.food-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0; 
    width: 100%;
}

.food-list li {
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

.food-list li:hover {
    background-color: #f1f1f1;
    cursor: pointer;
}




</style>

