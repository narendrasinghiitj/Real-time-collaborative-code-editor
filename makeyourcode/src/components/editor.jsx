import React, { useEffect } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/liquibyte.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/closebrackets.js'

const Editor = () => {
    useEffect(() => {
        async function init(){
            const editorInstance = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
                mode: {name: 'javascript', json: true },
                theme: 'liquibyte',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });
            editorInstance.setValue('funtion hello() {};');
        }
        init();
    }, []);
    return <textarea id="realtimeEditor"></textarea>
}

export default Editor