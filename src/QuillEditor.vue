<template>
  <div id="edit"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';

// 用ref创建一个Quill实例的引用
const quillInstance = ref(null);

onMounted(() => {
  // 初始化Quill编辑器
  quillInstance.value = new Quill('#edit', {
    theme: 'snow',
  });

  // 初始化Yjs文档
  const ydoc = new Y.Doc();
  const ytext = ydoc.getText('quill');
  
  // 绑定Quill编辑器与Yjs
  new QuillBinding(ytext, quillInstance.value);

  // 使用WebRTC进行连接
  new WebrtcProvider('quill-demo-room', ydoc);
});
</script>

<style scoped>
#edit {
  height: 300px; /* 确保编辑器有足够的高度 */
}
</style>
