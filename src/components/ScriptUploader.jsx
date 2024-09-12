import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ScriptUploader = ({ onScriptUpload }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        onScriptUpload(content.split('\n').filter(line => line.trim() !== ''));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input type="file" accept=".txt" onChange={handleFileUpload} />
      <Button onClick={() => document.querySelector('input[type="file"]').click()}>
        Upload Script
      </Button>
    </div>
  );
};

export default ScriptUploader;