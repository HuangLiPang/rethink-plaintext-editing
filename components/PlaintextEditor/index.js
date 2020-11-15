import React, { useState, useMemo, useEffect } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import PropTypes from 'prop-types';

import css from './style.css';

function PlaintextEditor({ file, index, files, setFiles }) {
  const [value, setValue] = useState(initialValue);
  const fs = files;
  useEffect(() => {
    (async () => {
      const v = await file.text()
      setValue([
        {
          children: [
            { text: v },
          ],
        },
      ]);
    })();
  }, [file]);
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <div className={css.editor}>
      <Slate editor={editor} value={value} onChange={ value => {
          const v = value[0].children[0].text;
          fs[index] = new File([v], fs[index].name, {
            type: fs[index].type,
            lastModified: new Date()
          });
          setFiles(fs);
          setValue(value);
        }}>
        <Editable placeholder="Enter some plain text..." />
      </Slate>
    </div>
  );
}

const initialValue = [
  {
    children: [
      { text: '' },
    ],
  },
];

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
