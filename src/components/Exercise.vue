<template>
    <ExerciseModal v-if="showModal" @close="toggleModal" />
    <div class="exercise">
      <div class="exercise-header">
        <h1>Exercise</h1>
        <button class="addExercise" @click="toggleModal">Add/Remove Activities</button>
      </div>
      <div class="current-exercises">
        <h2>Todays Activities</h2>

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

                console.log("test2", new Date(data.exerciseHistory[0].date).toLocaleDateString('en-US'))
                console.log("test3", new Date().toLocaleDateString('en-GB'))

                if (data.exerciseHistory) {                
                        this.exercises = data.exerciseHistory
                        .filter(exercise => new Date(exercise.date).toLocaleDateString('en-US') === new Date().toLocaleDateString('en-GB'))
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
    width: 50%;
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

  ul {
    list-style-type: none; 
    padding: 0; 
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