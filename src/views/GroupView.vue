<template>
    <Navigation />
    <CreateGroupModal v-if="showCreateModal" @close="toggleCreateModal" />
    <ManageGroupModal v-if="showManageModal" @close="toggleManageModal" />
    <div class="group">
        <div class="group-header">
            <h1>Your Groups</h1>
            <div class="input-button-wrapper">
                <p v-if="joinErr" class="error">{{ joinErr }}</p>
                <input v-model="joinCode" type="text" placeholder="Join a group with code"/>
                <button class="new-group" @click="joinGroup">Join</button>
                <button class="new-group" @click="toggleCreateModal">Create Group</button>
            </div>
        </div>
        <div v-if="groups.length > 0" class="group-list">   
            <ul>
                <li v-for="(group, index) in groups" :key="index">
                    <h3>{{ group.name }}</h3>
                    <p v-if="group.isOwner">You are the owner of this group</p>
                    <button v-if="group.isOwner" class="new-group" @click="toggleManageModal">Manage</button>
                    <button v-else class="new-group" @click="leaveGroup(group.id)">Leave</button>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>Join or create a group!</p>
        </div>
    </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import CreateGroupModal from '@/components/CreateGroupModal.vue';
import ManageGroupModal from '@/components/ManageGroupModal.vue';

export default {
    data() {
        return {
            showCreateModal: false,
            showManageModal: false,
            groups: [],
            joinErr: '',
            createErr: '',
            joinCode: '',
        }
    },
    components: {
        Navigation, CreateGroupModal, ManageGroupModal
    },
    methods: {
        toggleCreateModal() {
            this.showCreateModal = !this.showCreateModal
        },
        toggleManageModal() {
            this.showManageModal = !this.showManageModal
        },
        async getGroups() {
            const res = await fetch('http://localhost:5000/get-groups', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();

                this.groups = data.formattedGroups.map(group => {
                    return {
                        id: group.id,
                        name: group.name,
                        isOwner: group.ownerId === group.userId,
                        members: group.members,
                    }
                });
            
            } else {
                console.error("Error fetching groups");
            }
        },
        async joinGroup() {
            const res = await fetch('http://localhost:5000/join-group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ joinCode: this.joinCode }),
            });

            const data = await res.json();

            if (res.ok) {
                this.getGroups();
            } else {
                this.joinErr = data.message;
                console.error("Error joining group");
            }
        },
        async leaveGroup(id) {

            const res = await fetch('http://localhost:5000/leave-group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });

            const data = await res.json();

            if (res.ok) {
                this.getGroups();
            } else {
                console.error("Error leaving group");
            }
        }
    },
    mounted() {
        this.getGroups();
    }
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

.input-button-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
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

.group-list {
    padding: 20px;
    border: 1px solid #c1c1c1;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 10px;
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

</style>