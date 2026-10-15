import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/liquibyte.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/closebrackets.js'
import ACTIONS from '../Actions'

const Editor = ({socketRef, roomId}) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init(){
            if(!editorRef.current){
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'), {
                mode: {name: 'javascript', json: true },
                theme: 'liquibyte',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });
            }

            
            editorRef.current.on('change', (instance, changes) => {
                console.log('changes', changes);
                const {origin} = changes;
                const code = instance.getValue();
                if(origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    })  
                }
                console.log(code);
            })
            // if(editorRef.current) {
            //     editorRef.current.setValue('console.log');
            // }
            
        }
        init();
        return () => {
            if(editorRef.current){
                editorRef.current.toTextArea();
                editorRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        if(socketRef.current){
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
                if(code !== null){
                    editorRef.current.setValue(code);
                }
            })
        }

    }, [socketRef.current]);
    
    return <textarea id="realtimeEditor"></textarea>
}

export default Editor