<template>
    <Navigation />
    <Notification v-if="showNotification"/>
    <Dashboard />
    <Goals />
    <Foods />
    <Exercises />
</template>

<script>
// Component imports
import Navigation from '../components/Navigation.vue'
import Goals from '../components/Goal.vue'
import Foods from '../components/Food.vue'
import Exercises from '../components/Exercise.vue'
import Notification from '../components/Notification.vue'
import Dashboard from '../components/Dashboard.vue'

export default {
 components: {
    Navigation,
    Goals,
    Foods,
    Exercises,
    Notification,
    Dashboard,
 },

  data() {
    return {
        showNotification: null,
    }
  },
  methods: {

    checkDay() {
        
    }

  }
}
</script>

<style scoped>

.dashboard {
    padding: 20px;
    background-color: white;
    width: 50%;
    margin: 0 auto;
    margin-bottom: 20px;;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.dashboard h1 {
    text-align: left;
}

@media only screen and (orientation: portrait){
  .dashboard{
    float: none;
    margin: 0 auto;
    width: 85%;
    margin-bottom: 5px;
   }
  }

</style>