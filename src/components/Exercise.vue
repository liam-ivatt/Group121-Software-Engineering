<template>
    <ExerciseModal v-if="showModal" @close="toggleModal" />
    <div class="goals">
      <div class="goals-header">
        <h1>Exercise</h1>
        <button class="addGoal" @click="toggleModal">Add new food</button>
      </div>
      <div class="current-goals">
        <h2>Exercise History</h2>
      </div>
    </div>  
  </template>
  
  <script>
  import ExerciseModal from './ExerciseModal.vue'
  
  export default {
    components: { ExerciseModal,
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
    display: flex;
    flex-direction: column; 
    padding: 20px;
    background-color: white;
    width: 50%;
    margin: 0 auto;
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
  
  </style>