import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

const VoiceInput = ({ onTranscript }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'ja' });

  if (!browserSupportsSpeechRecognition) {
    return <span>ブラウザが音声認識をサポートしていません。</span>;
  }

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={listening ? handleStopListening : startListening}
        variant="outline"
        size="icon"
      >
        {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      {listening && <span className="text-sm text-gray-500">音声入力中...</span>}
    </div>
  );
};

export default VoiceInput;