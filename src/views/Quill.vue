<template>
  <input v-model="editTitle" id="editTitle" class="editTitle">
  <div id="edit"></div>
  <button id="pendingListsBtn" @click="saveNoteChanges">Save</button>
  <button id="pendingListsBtn" @click="back">Back</button>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { myQuill, myYjs } from '/src/utils/quill.js';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();
const noteId = route.params.noteId;
const editTitle = ref('');
const version = ref('');
const editContent = ref('');
const quill = ref('');
const yjs = ref('');
const jwtToken = sessionStorage.getItem('token');
    
if (!jwtToken) {
  alert('Please log in to view your Memos.');
  router.push('/login');
}

const fetchNoteDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/notes/${noteId}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': jwtToken
      }
    });
    editTitle.value = response.data.data.title;
    version.value = response.data.data.version;
    if (!quill.value) {
      quill.value = new myQuill("#edit");
      yjs.value = new myYjs(quill.value, noteId);
    }

    if (quill.value && quill.value.quill) {
      quill.value.quill.clipboard.dangerouslyPasteHTML(response.data.data.content || '');
    }
  } catch (error) {
    console.error('Fetch note details error:', error);
  }
};


const saveNoteChanges = async () => {
  if (quill.value) {
    editContent.value = quill.value.getHTML();
  }
    try {
      await axios.put(`http://localhost:8080/api/notes`, {
        id: noteId,
        title: editTitle.value,
        content: editContent.value,
        version: version.value
      }, {
        headers: {
          'Content-Type': 'application/json',
          'token': jwtToken,
        }
      });
      fetchNoteDetails();
    } catch (error) {
      console.error('Error saving note changes:', error);
    }
};

const back = () => {
  router.go(-1);
};

onMounted(async () => {
  fetchNoteDetails();
});

</script>

<style>
@import "@/assets/style.css";
</style>