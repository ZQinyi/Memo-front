<template>
  <div class="app-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>MemoMind</h3>
        <button id="pendingListsBtn" @click="navigatePending">Inv</button>
        <button id="addNoteBtn" @click="addNote">+</button>
      </div>
      <div v-for="note in notes" :key="note.id" class="note-item">
        <button class="delete-note-btn" @click="deleteNote(note.id)">-</button>
        <span class="note-title" @click="fetchNoteDetails(note.id)">{{ note.title }}</span>
      </div>
    </div>
    <div class="main-content">
        <input v-model="editTitle" id="editTitle" class="editTitle">
        <div ref="editor" id="editor"></div>
      <div>
        <input v-model="inviteeId" type="text" id="inviteeId" placeholder="Enter the InviteeID">
        <button id="sendInvitationBtn" @click="sendInvitation">SEND</button>
        <button id="coEdit" @click="coEdit">Collaborative Editing</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import Quill from 'quill';
import { myQuill, myYjs } from '/src/utils/quill.js';

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;
const jwtToken = sessionStorage.getItem('token');
const notes = ref([]);
const editTitle = ref('');
const inviteeId = ref('');
const errorMessage = ref('');
const currentNoteId = ref(null);
let autoSaveInterval = null;

const editorInstance = ref(null);

const autoSave = () => {
  console.log("Attempting to auto-save...");
  saveNoteChanges();
};


if (!jwtToken) {
    alert('Please log in to view your Memos.');
    router.push('/login');
} else {
    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    const JWTuserId = payload.id;

    if (JWTuserId != userId) {
        alert('Please log in to view your Memos.');
        router.push('/login');
    }
}


// 从API获取笔记列表
const fetchNotes = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/${userId}/notes`, {
    headers: {
        'Content-Type': 'application/json',
        'token': jwtToken
    }
    });
    notes.value = response.data.data;
    
  } catch (error) {
    console.error('Fetch notes error:', error);
    errorMessage.value = 'Failed to fetch notes.';
  }
};


const fetchNoteDetails = async (noteId) => {
  currentNoteId.value = noteId;
  try {
    const response = await axios.get(`http://localhost:8080/api/notes/${noteId}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': jwtToken
      }
    });
    editTitle.value = response.data.data.title;
    await nextTick();

    if (!editorInstance.value) {
      editorInstance.value = new Quill('#editor', { theme: 'snow' });
    }
    // 设置编辑器内容
    editorInstance.value.root.innerHTML = response.data.data.content || '';
  } catch (error) {
    console.error('Fetch note details error:', error);
  }
};


const navigatePending = async () => {
  router.push(`/${userId}/pendings`);
};

const addNote = async () => {
    const defaultNote = {
        title: "New Note",
        content: "Note content here..."
    };

    try {
        await axios.post(`http://localhost:8080/api/${userId}/notes`, defaultNote, {
            headers: {
                'Content-Type': 'application/json',
                'token': jwtToken
            }
        });
        await fetchNotes();
    } catch (error) {
        console.error('Error adding note:', error);
    }
};


const deleteNote = async (noteId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/${userId}/notes/${noteId}`, {
            headers: {
                'Content-Type': 'application/json',
                'token': jwtToken
            },
        });
        if (response.status === 403) {
            alert("Sorry! Only the creator of the Note has the right to delete the Note!");
            return;
        }
        await fetchNotes();
    } catch (error) {
        console.error('Error deleting note:', error.response ? error.response.data : error.message);
    }
};


const saveNoteChanges = async () => {
    const content = editorInstance.value.root.innerHTML;
    try {
      await axios.put(`http://localhost:8080/api/notes`, {
        id: currentNoteId.value,
        title: editTitle.value,
        content: content,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'token': jwtToken,
        }
      });
      fetchNotes();
    } catch (error) {
      console.error('Error saving note changes:', error);
    }
  
};


const sendInvitation = async () => {
    if (!inviteeId) {
        alert('Please enter the invitee ID!');
        return;
    }

    try {
        const response = await axios.put(`http://localhost:8080/api/${userId}/send`, {
            noteId: currentNoteId.value,
            inviteeId: inviteeId.value,
            inviterId: userId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'token': jwtToken
            }
        });

        if (response.status === 200) {
            alert('Invitation sent successfully!');
        } else {
            throw new Error('Response not OK');
        }
    } catch (error) {
        console.error('Error sending invitation:', error);
        alert('Failed to send the invitation.');
    }
};

const coEdit = async () => {
  const noteId = currentNoteId.value;
  router.push(`/${noteId}/quill`);
};

watch(currentNoteId, async (newId) => {
    if (newId) {
      await fetchNoteDetails(newId);
    }
});


onMounted(() => {
    fetchNotes();
    autoSaveInterval = setInterval(autoSave, 10000); 

});

onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});

</script>

<style scoped>
@import "@/assets/style.css";
</style>