<template>
    <Navigation />
    <CreateGroupModal v-if="showModal" @close="toggleModal" />
    <div class="group">
        <div class="group-header">
            <h1>Groups</h1>
            <input type="text" placeholder="Join a group with code"/>
            <button class="new-group" @click="toggleModal">Create Group</button>
        </div>
    </div>

</template>

<script>
import Navigation from '../components/Navigation.vue'
import CreateGroupModal from '@/components/CreateGroupModal.vue';

export default {

    data() {
        return {
            showModal: false,
        }
    },

 components: {
    Navigation, CreateGroupModal
 },
 methods: {
    toggleModal() {
            this.showModal = !this.showModal
        },
    },
}

</script>

<style scoped>

.group {
    display: flex;
    flex-direction: column; 
    padding: 20px;
    background-color: white;
    width: 70%;
    margin: 0 auto;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.group-header {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    width: 100%;
    margin-bottom: 20px; 
  }
  

h1 {
    margin: 0; 
}

.new-group {
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

.new-group:hover {
    background-color: #eee;
}

ul {
    list-style-type: none; 
    padding: 0; 
}

input {
    background-color: white;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    padding: 15px 20px;
    text-decoration: none;
    font-size: 15px; 
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