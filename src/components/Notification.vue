<template>
    <Modal v-if="showModal" @close="toggleModal" />
    <div>
        <h1 class="header">Log your weight for today!</h1>
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
h1 {
    color: white;
}

.header {
    margin-right: auto;
}

div {
    display: flex;
    align-items: center;
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 1%;
    padding-bottom: 1%;
    background-color: crimson;
    width: 86%;
    margin: 0 auto;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
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

.profile {
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