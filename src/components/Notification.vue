<template>
    <Modal v-if="showModal" @close="toggleModal" />
    <div>
        <h1 class="header">Log your weight for this week!</h1>
        <button class="profile" @click="toggleModal">Log Weight</button>
    </div>
    
</template>

<script>
import Modal from './Modal.vue'

export default {
  components: { Modal,
  },
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
        toggleModal() {
            this.showModal = !this.showModal
        },
    },
}

</script>

<style scoped>
h1{
  margin: 0;
  color: #ffffff;
  font-size: 22px;                   
  font-weight: 600;
  flex: 1 1 auto;   
}

.header {
    margin-right: auto;
}

div{
  display: flex;
  align-items: center;
  justify-content: space-between;      
  gap: 16px;                           
  width: 86%;                          
  max-width: 1100px;                   
  margin: 0 auto 20px;                
  padding: 16px 24px;                  
  background-color: crimson;
  border: 2px solid #b92b2b;           
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,.24);
}

.logout {
    background-color: white;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    color: black;
    background-color: #fc4747;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    cursor: pointer;
    margin-left: 10px;
    float: right;
}

.logout:hover {
    background-color: #eee;
}

.profile{
  background-color: #ffffff;
  border: 2px solid crimson;
  border-radius: 8px;
  color: crimson;
  padding: 12px 24px;              
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .2s;
}

.profile:hover {
    background-color: #eee;
}

@media only screen and (orientation: portrait){
  div{
    position: relative;
    width: 96%;
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 1%;
    padding-bottom: 1%;
    margin-bottom: 5px;
  }
}

</style>