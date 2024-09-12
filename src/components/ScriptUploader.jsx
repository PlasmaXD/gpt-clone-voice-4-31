import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ScriptUploader = ({ onScriptUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        onScriptUpload(content.split('\n').filter(line => line.trim() !== ''));
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .txt file.');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <Button onClick={handleButtonClick}>
        Upload Script
      </Button>
    </div>
  );
};

export default ScriptUploader;