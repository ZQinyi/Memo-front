<template>
  <div id="edit"></div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { myQuill, myYjs } from '/src/utils/quill.js';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const noteId = route.params.noteId;


    onMounted(async () => {
      const quill = new myQuill("#edit");

      const yjs = new myYjs(quill, noteId);

    });

    return {
      
    };
  }
};
</script>

<style>
</style>