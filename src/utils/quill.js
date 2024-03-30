// 导出Quill实体类
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
 
export class myQuill {
  constructor(selector) {

    Quill.register("modules/cursors", QuillCursors);

    // 初始化 quill 文档操作对象
    this.quill = new Quill(selector, {
        modules: {
            cursors: true,
        },
        theme: "snow",
        placeholder: "Please insert content...",
    });
  }
}
 
// 导出 Yjs 实体类
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
 
export class myYjs {
  // 需要传入绑定对象
    constructor(quill, noteId) {
        // A Yjs document holds the shared data
        this.ydoc = new Y.Doc();

        const uniqueDocName = `quill-${noteId}`;
 
        // Define a shared text type on the document（这个是拿到需要协同的 Delta 数据）
        const ytext = this.ydoc.getText(uniqueDocName);
 
        // 使用webrtc实现连接
        const provider = new WebrtcProvider(uniqueDocName, this.ydoc);

        // 绑定 quill与YJS
        const binding = new QuillBinding(ytext, quill.quill, provider.awareness);
    }

    createAwareness(name) {
        let { awareness } = this.provider;
        let color = "#" + Math.random().toString(16).split(".")[1].slice(0, 6);
        awareness.setLocalStateField("user", { name, color });
        return awareness;
    }
}