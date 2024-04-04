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

  getHTML() {
    return this.quill.root.innerHTML;
  }
}
 
// 导出 Yjs 实体类
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";

export class myYjs {
    constructor(quill, noteId) {
        this.ydoc = new Y.Doc();
        const uniqueDocName = `quill-${noteId}`;
        this.ytext = this.ydoc.getText(uniqueDocName);

        // 作为类属性
        this.provider = new WebrtcProvider(uniqueDocName, this.ydoc);
        new QuillBinding(this.ytext, quill.quill, this.provider.awareness);
    }

    createAwareness(name) {
        let color = "#" + Math.random().toString(16).split(".")[1].slice(0, 6);
        this.provider.awareness.setLocalStateField("user", { name, color });
    }
}