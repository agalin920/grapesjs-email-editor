import {useRef, useState} from 'react';
import { GrapesjsReact } from 'grapesjs-react';
import Modal from '@mui/material/Modal';
import 'grapesjs-preset-newsletter';

// imports required css for grapejs
import "../node_modules/grapesjs/dist/css/grapes.min.css";

function App() {

  const instance = useRef();

  const handleHtmlEdit = () => {
  //   instance.current.Modal.open({
  //     title: 'HTML',
  //     content: instance.current.getHtml(),
  // });
    // Triggers modal open event on editor
    instance.current.Modal.open();
  }

  const [isEditing, setIsEditing] = useState(false); 
  const [currHtml, setCurrHtml] = useState(''); 

  return (
    <>
    <div >
      <button onClick={handleHtmlEdit}>Open html editor</button>
      <GrapesjsReact
        id='grapesjs-react'
        plugins={[
          'gjs-preset-newsletter',
          'gjs-blocks-basic'
        ]}
        // Option allows us to render custom modal since built in can only show tex
        modal={{ custom: true }}
        onInit={(editor) => {
          // Refs the instance of the editor
          instance.current = editor;
          editor.onReady(() => {
            // Parsing will be required depending on html to extract stylesheet
            // const {Parser} = editor;
            // const resHtml = Parser.parseHtml(`<table><div>Hello World</div></table>`, {
            //   htmlType: 'text/html', // default
            // });

            // Sets editor components
            editor.setComponents('<table><div>Hello World</div></table>');

            // Sets editor style
            //editor.setStyle();
            
            // Sets option on RTE for adding token
            editor.RichTextEditor.add('tokenVariable', {
              icon: `<select>
                    <option>some variable</option>
                    <option>some other variable</option>
                    <option>some third variable</option>
                  </select>`,
                // Bind the 'result' on 'change' listener
              event: 'change',
              // Executes rte command to insert text
              result: (rte, action) => rte.exec("insertText", action.btn.firstChild.value),
              // Callback on any input change (mousedown, keydown, etc..)
              // Updates actual rte option
              update: (rte, action) => {
                console.log('im in 2', action)
                // const value = rte.doc.queryCommandValue(action.name);
                // if (value != 'false') { // value is a string
                //   action.btn.firstChild.value = value;
                // }
               }
              })
          });

          // Acts on modal trigger
          editor.on('modal', () => {

              // State variable to open modal
              setIsEditing(true);

              // Sets curr html to state to store mutation
              setCurrHtml(instance.current.editor.getHtml())
          })
        }}
      />
    </div>
    <Modal
        open={isEditing}
        onClose={() => {
          // Set mutated html to editor state
          // We will most likely do a Parse here as well to overwrite any removed styles
          instance.current.editor.setComponents(currHtml);
          setIsEditing(false);
        }}
      >
        <div>
          {/* Text area to mutate html */}
          <textarea rows={6} value={currHtml} onChange={(e) => setCurrHtml(e.target.value)}/>
        </div>
      </Modal>
    </>
  )
}

export default App
