<template>
  <div class="app-container">
    <div class="pending-list">
      <div v-for="invitation in invitations" :key="invitation.invitationId" class="invitation-card">
        <p>"{{ invitation.username }}" invited you to co-edit on noteTitle: {{ invitation.noteTitle }}</p>
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

// Function to enrich invitation with username
const enrichInvitationWithUsername = async (invitation) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/${invitation.inviterId}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': jwtToken
      }
    });
    invitation.username = response.data.data.username; // Assuming username is directly available
  } catch (error) {
    console.error('Error fetching username:', error);
    invitation.username = 'Unknown'; // Fallback username
  }
};

// Function to enrich invitation with username
const enrichInvitationWithNotetitle = async (invitation) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/notes/${invitation.noteId}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': jwtToken
      }
    });
    invitation.noteTitle = response.data.data.title; // Assuming username is directly available
  } catch (error) {
    console.error('Error fetching username:', error);
    invitation.username = 'Unknown'; // Fallback username
  }
};

// Fetch invitations and enrich them with usernames
const fetchInvitations = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/${userId}/pending`, {
        headers: {
          'Content-Type': 'application/json',
          'token': jwtToken
        }
      });
      invitations.value = response.data.data;

      // Enrich each invitation with username
      await Promise.all(invitations.value.map(invitation => enrichInvitationWithUsername(invitation)));
      await Promise.all(invitations.value.map(invitation => enrichInvitationWithNotetitle(invitation)));
    } catch (error) {
      console.error('Error fetching pendings:', error);
    }
};

// Handle invitation
const handleInvitation = async (invitationId, accept) => {
    const action = accept ? 'Accept' : 'Decline';
    try {
        await axios.put(`http://localhost:8080/api/invitations/${action}/${invitationId}`, {}, {
            headers: {
              'Content-Type': 'application/json',
              'token': jwtToken
            }
        });
        alert(`${action} sucessfully!`);
        fetchInvitations();
    } catch (error) {
        console.error(`Error ${action}ing invitation:`, error);
        alert('You have already accepted the invitation for this note. Click "Decline" if you wish to reject it now.');
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