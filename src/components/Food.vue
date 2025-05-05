<template>
    <FoodModal v-if="showModal" @close="toggleModal" />
    <div class="goals">
      <div class="goals-header">
        <h1>Diet</h1>
        <button class="addGoal" @click="toggleModal">Add new food</button>
      </div>
      <div class="current-goals">
        <h2>Food History</h2>
      </div>
    </div>  
  </template>
  
  <script>
  import FoodModal from './FoodModal.vue'
  
  export default {
    components: { FoodModal,
    },
    data() {
      return {
        showModal: false,
      }
    },
    created() {
      this.getUserData();
    },
    methods: {
          toggleModal() {
              this.showModal = !this.showModal
          },
          async getUserData() {
              try {
                  const response = await fetch('http://localhost:5000/user', {
                      method: 'GET',
                      credentials: 'include',  
                  });
                  if (response.ok) {
                      const data = await response.json();
                      // PUT DATA IN HERE THAT YOU WANT TO RETRIEVE FROM THE BACKEND
                      this.firstName = data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
                  } else {
                      console.error('Error fetching user data');
                  }
              } catch (error) {
                  console.error('Error:', error);
              }
          },
      },
  }
  
  </script>
  
  <style scoped>
  .goals {
    position: block;
    margin-right: 5%;
    float: right;
    display: flex;
    flex-direction: column; 
    padding: 20px;
    background-color: white;
    width: 40%;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
  
  .goals-header {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    width: 100%;
    margin-bottom: 20px; 
  }
  
  h1 {
    margin: 0; 
  }
  
  .current-goals {
      float: left;
  }
  
  .addGoal {
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
  
  .addGoal:hover {
    background-color: #eee;
  }

  @media only screen and (orientation: portrait){
  .goals{
    float: none;
    margin: 0 auto;
    width: 85%;
    margin-bottom: 5px;
   }
  }
  
  </style>