import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const PDFReader = ({ onPDFContent }) => {
  const [pdfText, setPdfText] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const response = await fetch('/api/extract-pdf-text', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { text } = await response.json();
          setPdfText(text);
          onPDFContent(text);
        } else {
          console.error('Failed to extract PDF text');
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">PDFを読み込む</h2>
      <Input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {pdfText && (
        <ScrollArea className="h-60 border p-4 rounded">
          <p>{pdfText}</p>
        </ScrollArea>
      )}
    </div>
  );
};

export default PDFReader;