import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/liquibyte.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/closebrackets.js'
import ACTIONS from '../Actions'

const Editor = ({ socketRef, roomId }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        const socket = socketRef.current;
        const editor = Codemirror.fromTextArea(
            document.getElementById('realtimeEditor'), {
                mode: { name: 'javascript', json: true },
                theme: 'liquibyte',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });
        editorRef.current = editor;

        // local typing -> send to others
        editor.on('change', (instance, changes) => {
            if (changes.origin !== 'setValue') {
                socket.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code: instance.getValue(),
                });
            }
        });

        // others' typing -> show here
        const handleCodeChange = ({ code }) => {
            if (code !== null && editor.getValue() !== code) {
                const cursor = editor.getCursor();   // keep cursor from jumping
                editor.setValue(code);
                editor.setCursor(cursor);
            }
        };
        socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);

        return () => {
            socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
            editor.toTextArea();
            editorRef.current = null;
        };
    }, []);

    return <textarea id="realtimeEditor"></textarea>
}

export default Editor