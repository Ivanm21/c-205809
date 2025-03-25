import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
}

const AudioRecorder = ({ onTranscription }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioForTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please ensure you have granted microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioForTranscription = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('data', audioBlob);

      const response = await fetch('https://crypto-narrative.app.n8n.cloud/webhook/efb9c2a6-b786-4cfc-9c84-968f807b8f10', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      if (data.text) {
        onTranscription(data.text);
      } else {
        throw new Error('No transcription received');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
      className={`border-0 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-[#1f1b33]/80 hover:bg-blue-600/80'
      }`}
    >
      {isRecording ? (
        <div className="h-2.5 w-2.5 rounded bg-red-700" />
      ) : (
        <Mic className="h-4 w-4 text-white" />
      )}
    </Button>
  );
};

export default AudioRecorder; 