import { height } from 'pdfkit/js/page';
import React, { useState } from 'react';

interface TextAreaComponentProps {
  value?: string; // Change to optional prop
  onChange: (value: string) => void;
}

const TextAreaComponent: React.FC<TextAreaComponentProps> = ({ value = '', onChange }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    onChange(newText);
  };


return (
  <textarea
  value={value}
  onChange={handleTextChange}
  placeholder="Write anything here..."
  className='textarea bg-[#d0cece]  text-[#424242]'
  style={{ borderRadius: ".5rem", padding: "1rem", width:"100%",overflow:"hidden", border:"none",outline:"none",height:"fit-content"}}
  
/>
  );
};

export default TextAreaComponent;

