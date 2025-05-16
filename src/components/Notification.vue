<template>
    <WeightModal v-if="showModal" @close="toggleModal" />
    <div>
        <h1 class="header">Log your weight for today!</h1>
        <button class="profile" @click="toggleModal">Log Weight</button>
    </div>
    
</template>

<script>
import WeightModal from '../components/WeightModal.vue'

export default {
  components: { WeightModal,
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
  margin: 0 auto 20px;                
  padding: 16px 24px;                  
  background-color: crimson;          
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

@media screen and (max-width: 426px) {
    div {
        flex-direction: column;
        width: 80%;
        padding: 20px 15px;
        gap: 15px;
    }
    
    h1 {
        font-size: 18px;
        text-align: center;
    }
    
    .header {
        margin-right: 0;
    }
    
    .profile {
        width: 100%;
        padding: 10px 0;
        font-size: 14px;
    }
    
    form {
        width: 100%;
        margin: 10px auto;
    }
    
    .form-group {
        flex-direction: column;
        gap: 10px;
    }
    
    form label {
        width: 100%;
        text-align: center;
        margin-bottom: 5px;
    }
    
    form select, input {
        width: 80%;
    }
    
    form button {
        margin: 0 auto;
    }
}

</style>