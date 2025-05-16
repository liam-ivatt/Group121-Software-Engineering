<template>
    <Navigation />
    <Notification v-if="showNotification" :notificationColor="notificationColor" :notificationMessage="notificationMessage"/>
    <Dashboard @weightUpdated="handleWeightUpdate" />
    <Goals :currentWeight="currentWeight" />
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
                    this.userData = data;
                    this.bmi = data.bmi.toFixed(2);

                    if (data.weightHistory) {
                        this.data = {
                            labels: data.weightHistory.map(entry => new Date(entry.date).toLocaleDateString()),
                            datasets: [
                                {
                                    label: 'Weight History',
                                    data: data.weightHistory.map(entry => entry.weight)
                                }
                            ]
                        };
                    }
                    this.checkDay();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async updateGoalStatus() {
            try {
                const res = await fetch('http://localhost:5000/update-goal-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ userId: this.userData._id }) // Send userId
                });
                if (res.ok) {
                    this.userData.goalCurrentlyActive = 0;
                    console.log("Goal set to inactive");
                } else {
                    console.error('Failed to set goal inactive');
                }
            } catch (error) {
                console.error('Error setting goal inactive:', error);
            }
        },

        async checkDay() {
            if (!this.userData) {
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

            if (this.userData.goalCurrentlyActive == 1 && this.userData.goalsHistory.length > 0) {
                const activeGoal = this.userData.goalsHistory[this.userData.goalsHistory.length - 1];

                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
                const targetDate = new Date(activeGoal.targetDate);
                targetDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
                console.log("Target date: " + targetDate);
                console.log("Today: " + today);

                const latestWeightDate = this.userData.weightHistory[this.userData.weightHistory.length - 1];
                const weightDate = new Date(latestWeightDate.date);
                weightDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison

                if (weightDate.getTime() === today.getTime() && !(activeGoal.targetWeight >= this.userData.weight)) {
                    console.log("Weight already logged for today.");
                    this.showNotification = false;
                    return;
                }

                if (targetDate > today) {
                    if (activeGoal.targetWeight >= this.userData.weight) {
                        this.showNotification = true;
                        this.notificationColor = "green";
                        this.notificationMessage = 'Congratulations, you have reached your goal!';
                        await this.updateGoalStatus();
                    } else {
                        this.showNotification = true;
                        this.notificationColor = "orange";
                        this.notificationMessage = 'Log your weight for today!';
                    }
                } else {
                    this.showNotification = true;
                    this.notificationColor = "red";
                    this.notificationMessage = 'Your goal has expired, please set a new one!';
                    await this.updateGoalStatus();
                }

            } else {
                this.showNotification = false;
            }
        },
        handleWeightUpdate(newWeight) {
            this.currentWeight = newWeight;
            this.getUserData();
        },
    },

    data() {
        return {
            showModal: false,
            showNotification: false,
            notificationColor: 'orange',
            notificationMessage: 'Log your weight for today!',
            currentWeight: null,
        }
    },
    created() {
        this.getUserData();
    },
}

</script>

<style scoped>
.dashboard {
    padding: 20px;
    background-color: white;
    width: 50%;
    margin: 0 auto;
    margin-bottom: 20px;
    ;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.dashboard h1 {
    text-align: left;
}

@media only screen and (orientation: portrait) {
    .dashboard {
        float: none;
        margin: 0 auto;
        width: 85%;
        margin-bottom: 5px;
    }
}
</style>