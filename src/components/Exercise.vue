<template>
    <ExerciseModal v-if="showModal" @close="toggleModal" @deleteExercise="getUserData" />
    <div class="exercise">
      <div class="exercise-header">
        <h1>Exercise</h1>
        <button class="addExercise" @click="toggleModal">Add/Remove Activities</button>
      </div>
      <div class="current-exercises">
        <h2>Today's Activities</h2>

        <div class="exercise-list">
          <ul>
            <h3 v-if="exercises.length === 0">No activities logged today!</h3>
            <li v-for="(item, index) in exercises" :key="index">
              <h3>{{ item.name }}</h3>
              <p v-if="item.name === 'Running'">Distance: {{ item.stat }}km</p>
              <p v-if="item.name !== 'Running'">Duration: {{ item.stat }} minutes</p>
            </li>
          </ul>
        </div> 

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
        exercises: [],
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
                  const res = await fetch('http://localhost:5000/user', {
                      method: 'GET',
                      credentials: 'include',  
                  });

                if (res.ok) {

                const data = await res.json();

                const today = new Date().toLocaleDateString('en-GB');

                if (data.exerciseHistory) {                
                        this.exercises = data.exerciseHistory
                        .filter(exercise => exercise.date === today)
                        .map(exercise => {
                            return {
                              name: exercise.exercise,
                              stat: exercise.exerciseStat,
                            };
                        });
                } else {
                    console.error('Error fetching user data');
                }
                }
                  
              } catch (error) {
                  console.error('Error:', error);
              }
          },
          mounted() {
              this.getUserData();
          },
      },
  }
  
  </script>
  
  <style scoped>
  .exercise {
    display: flex;
    flex-direction: column; 
    padding: 20px;
    background-color: white;
    width: 40%;
    margin: 0 auto;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  
  .exercise-header {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    width: 100%;
    margin-bottom: 20px; 
  }
  
  h1 {
    margin: 0; 
  }
  
  .addExercise {
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
  
  .addExercise:hover {
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

  @media only screen and (orientation: portrait){
    .exercise{
      float: none;
      margin: 0 auto;
      width: 85%;
      margin-bottom: 5px;
    }
  }


  
  </style>