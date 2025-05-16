<template>
    <Navigation />
    <CreateGroupModal v-if="showCreateModal" @close="toggleCreateModal" @createGroup="getGroups" />
    <ManageGroupModal v-if="showManageModal" @close="toggleManageModal" @removeUser="getGroups" @removeGroup="getGroups"
        :group="selectedGroup" />
    <ManageUserModal v-if="showUserModal" @close="toggleManageUserModal" @leaveGroup="getGroups"
        :group="selectedGroup" />
    <div class="group">
        <div class="group-header">
            <h1>Your Groups</h1>
            <div class="input-button-wrapper">
                <p v-if="joinErr" class="error">{{ joinErr }}</p>
                <input v-model="joinCode" type="text" placeholder="Join a group with code" />
                <button class="new-group" @click="joinGroup">Join</button>
                <button class="new-group" @click="toggleCreateModal">Create Group</button>
            </div>
        </div>
        <div v-if="groups.length > 0" class="group-list">
            <ul>
                <li v-for="(group, index) in groups" :key="index">
                    <h3>{{ group.name }}</h3>
                    <p v-if="group.isOwner">You are the owner of this group</p>
                    <p v-else>Member</p>
                    <button v-if="group.isOwner" class="new-group" @click="manageGroup(group)">Manage</button>
                    <button v-else class="new-group" @click="manageUserGroup(group)">View</button>
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
import ManageUserModal from '@/components/ManageUserModal.vue';

export default {
    data() {
        return {
            showCreateModal: false,
            showManageModal: false,
            showUserModal: false,
            groups: [],
            joinErr: '',
            createErr: '',
            joinCode: '',
            selectedGroup: null,
        }
    },
    components: {
        Navigation, CreateGroupModal, ManageGroupModal, ManageUserModal
    },
    methods: {
        toggleCreateModal() {
            this.showCreateModal = !this.showCreateModal
        },
        toggleManageModal() {
            this.showManageModal = !this.showManageModal
        },
        toggleManageUserModal() {
            this.showUserModal = !this.showUserModal
        },
        manageUserGroup(group) {
            this.selectedGroup = group;
            this.toggleManageUserModal();
        },
        manageGroup(group) {
            this.selectedGroup = group;
            this.toggleManageModal();
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
                        ownerId: group.ownerId,
                        members: group.members,
                        joinCode: group.joinCode
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
                this.joinCode = '';
                this.joinErr = '';
            } else {
                this.joinErr = data.message;
                console.error("Error joining group");
            }
        },
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

.error {
    color: red;
    margin: 0;
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
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    margin: 0 auto;
    height: auto;
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.group-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    width: 100%;
}

.group-list li {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.group-list h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 16px;
}

.group-list p {
    color: #666;
    font-size: 14px;
    margin: 0 0 15px 0;
}

.group-list button {
    margin-top: 10px;
    width: 100%;
}

@media screen and (max-width: 426px) {
    .group {
        width: 90%;
        padding: 15px;
    }

    .group-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .input-button-wrapper {
        flex-direction: column;
        width: 100%;
        align-items: stretch;
    }

    .input-button-wrapper input {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 10px;
    }

    .input-button-wrapper button {
        width: 100%;
        margin-bottom: 10px;
    }

    .group-list {
        padding: 10px;
        max-height: 400px;
    }

    .group-list ul {
        grid-template-columns: 1fr;
    }

    .group-list li {
        padding: 12px;
        margin-bottom: 10px;
    }

    .group-list h3 {
        font-size: 16px;
    }

    .group-list p {
        font-size: 14px;
    }

    .group-list button {
        padding: 10px 15px;
        font-size: 14px;
    }

    .new-group {
        padding: 12px 15px;
        font-size: 14px;
    }

    h1 {
        font-size: 22px;
        width: 100%;
        text-align: center;
    }

    .error {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }
}
</style>