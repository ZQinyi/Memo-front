<template>
  <div id="edit"></div>
</template>

<script>
import { onMounted } from 'vue';
import { myQuill, myYjs } from '/src/utils/quill.js'; // 调整路径以指向你的类定义

export default {
  setup() {
    onMounted(() => {
      // 获取dom需要在mounted后
      const quill = new myQuill("#edit");
      
      // 初始化YJS
      const yjs = new myYjs(quill);

      function onUserJoin(name) {
        yjs.createAwareness(name);
      }
    });
  }
};
</script>

<style>
</style>
