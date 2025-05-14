<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <form @submit.prevent>
                <h1>{{ groupName }}</h1>
                <div class="form-group">
                    <label>Invite User</label>
                    <input v-model="userEmail" type="email" placeholder="User Email">
                </div>
                <p v-if="msg" :class="{ 'success': !isError, 'error': isError }">{{ msg }}</p>
                <div class="form-group">
                    <button type="submit" @click="inviteUser">Invite User</button>
                </div>
            </form>

            <div class="user-list">
                <h3>Group Members</h3>
                <ul v-if="members && members.length">
                    <li v-for="(member, index) in members" :key="index">
                        {{ member.userName }}, {{ member.email }}
                        <button v-if="member._id !== ownerId" class="delete" disabled>User</button>
                        <button v-else class="delete" disabled>Owner</button>
                    </li>
                </ul>
                <p v-else>Loading members...</p>
            </div> 
        </div>
    </div>
</template>

<script>

export default {
    props: {
        group: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            groupName: '',
            userEmail: '',
            msg: '',
            isError: false,
            members: [],
            groupId: null,
            ownerId: null,
            joinCode: '',
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        async updateGroup() {
            try {
                const res = await fetch('http://localhost:5000/update-group', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        groupId: this.groupId,
                        groupName: this.groupName 
                    }),
                });
                
                const data = await res.json();

                if (res.ok) {
                    this.msg = data.message;
                    this.isError = false;
                } else {
                    this.msg = data.message;
                    this.isError = true;
                }
            } catch (error) {
                console.error("Error updating group:", error);
                this.msg = "Failed to update group";
                this.isError = true;
            }
        },
        async removeGroup() {
            try {
                const res = await fetch('http://localhost:5000/delete-group', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ groupId: this.groupId }),
                });

                const data = await res.json();

                if (res.ok) {
                    this.msg = data.message;
                    this.isError = false;
                    this.closeModal();
                } else {
                    this.msg = data.message;
                    this.isError = true;
                }
            } catch (error) {
                console.error("Error deleting group:", error);
                this.msg = "Failed to delete group";
                this.isError = true;
            }
        },
        async removeUser(userId) {
            try {
                const res = await fetch('http://localhost:5000/delete-group-member', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ userId, groupId: this.groupId }),
                });

                const data = await res.json();

                if (res.ok) {
                    this.msg = data.message;
                    this.isError = false;
                    this.members = this.members.filter(member => member._id !== userId);
                    this.$emit('removeUser')
                } else {
                    this.msg = data.message;
                    this.isError = true;
                }
            } catch (error) {
                console.error("Error removing user:", error);
                this.msg = "Failed to remove user";
                this.isError = true;
            }
        },
        async inviteUser() {

            try {
                const res = await fetch('http://localhost:5000/invite-group-member', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        joinCode: this.group.joinCode,
                        userEmail: this.userEmail 
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    this.msg = data.message;
                    this.isError = false;
                } else {
                    this.msg = data.message;
                    this.isError = true;
                }
            } catch (error) {
                console.error("Error inviting user:", error);
                this.msg = "Failed to invite user";
                this.isError = true;
            }
        }
    },
    created() {
        if (this.group) {
            this.groupName = this.group.name;
            this.groupId = this.group.id;
            this.ownerId = this.group.ownerId;
            this.members = this.group.members
            this.joinCode = this.group.joinCode
        }

    }
}
</script>

<style scoped>
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
    overflow-y: auto;
    width: 600px;
    padding: 20px;
    background: white;
    border-radius: 10px;
}

.backdrop {
    top: 0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
}

form {
    width: 500px;
    margin: 20px auto;
}

form h1 {
    display: block;
    text-align: center;
    padding-bottom: 10px;
}

.form-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
}

form select, input {
    width: 60%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #eee;
    outline: none;
    margin: 0;
}

form label {
    width: 25%;
    font-weight: 500;
}

form button {
    background-color: white;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    cursor: pointer;
    display: block;
    margin: 5px;
}

form button:hover {
    background-color: #eee;
}

.user-list {
    padding: 20px;
    border: 1px solid #c1c1c1;
    margin: 0 auto;
    border-radius: 10px;
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.user-list h3 {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.user-list ul {
    padding: 0;
    margin: 0;
}

.user-list li {
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

.delete {
    background-color: #ff6b6b;
    color: white;
    border: none;
    cursor: pointer;
    border: 1px solid #c1c1c1;
    border-radius: 10px;
    padding: 15px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    transition-duration: 0.4s;
    margin: 5px;
}

.delete:hover {
    background-color: #ff5252;
}

.modal::-webkit-scrollbar {
  display: none;  
}

.user-list::-webkit-scrollbar {
  display: none;  
}

.error {
    color: red;
    text-align: center;
}

.success {
    color: green;
    text-align: center;
}
</style>