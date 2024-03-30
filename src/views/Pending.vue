<template>
  <div class="app-container">
    <div class="pending-list">
      <div v-for="invitation in invitations" :key="invitation.invitationId" class="invitation-card">
        <p>Invitation from userId:{{ invitation.inviterId }} for noteId:{{ invitation.noteId }}</p>
        <button class="accept" @click="handleInvitation(invitation.invitationId, true)">Accept</button>
        <button class="decline" @click="handleInvitation(invitation.invitationId, false)">Decline</button>
      </div>
      <div v-if="invitations.length === 0">No pending invitations.</div>
      <button class="back-button" @click="goBack">BACK</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;
const invitations = ref([]);

// Session and JWT handling
const jwtToken = sessionStorage.getItem('token');
if (!jwtToken) {
    alert('Please log in to view your Pendings.');
    router.push('/login');
} else {
    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(window.atob(base64));
    const JWTuserId = payload.id;

    if (JWTuserId != userId) {
        alert('Please log in to view your Pendings.');
        router.push('/login');
    }
}

// Fetch invitations
const fetchInvitations = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/${userId}/pending`, {
        headers: {
          'Content-Type': 'application/json',
          'token': jwtToken
        }
      });
      invitations.value = response.data.data;
    } catch (error) {
      console.error('Error fetching pendings:', error);
    }
};

// Handle invitation
const handleInvitation = async (invitationId, accept) => {
    const action = accept ? 'accept' : 'decline';
    try {
        await axios.put(`http://localhost:8080/api/invitations/${action}/${invitationId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'token': jwtToken
            }
        });
        fetchInvitations();
    } catch (error) {
        console.error(`Error ${action}ing invitation:`, error);
    }
};

// Go back
const goBack = () => {
    router.go(-1);
};

onMounted(fetchInvitations);
</script>

<style scoped>
@import "@/assets/pendings.css";
</style>