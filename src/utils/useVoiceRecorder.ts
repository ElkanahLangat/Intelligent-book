import { useState, useRef, useCallback } from 'react';

interface VoiceRecorderState {
  isRecording: boolean;
  isTranscribing: boolean;
  duration: number;
  error: string | null;
}

export function useVoiceRecorder(onTranscribed: (text: string) => void) {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isTranscribing: false,
    duration: 0,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, duration: 0 }));
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine supported mimeType
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) {
          setState(prev => ({ ...prev, isRecording: false, isTranscribing: false }));
          return;
        }

        setState(prev => ({ ...prev, isRecording: false, isTranscribing: true }));

        try {
          // Convert Blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = reader.result as string;
            
            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Data,
                  mimeType
                })
              });
              const data = await res.json();
              if (data.text) {
                onTranscribed(data.text);
              }
            } catch (err: any) {
              console.warn('Transcribe request error:', err);
              onTranscribed('Voice note recorded.');
            } finally {
              setState(prev => ({ ...prev, isTranscribing: false }));
            }
          };
        } catch (e: any) {
          setState(prev => ({ ...prev, isTranscribing: false, error: e?.message || 'Failed to process audio' }));
        }
      };

      mediaRecorder.start(250); // collect in 250ms chunks
      setState(prev => ({ ...prev, isRecording: true }));

      // Duration counter
      timerRef.current = window.setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (err: any) {
      console.error('Microphone access error:', err);
      setState(prev => ({
        ...prev,
        isRecording: false,
        error: err.name === 'NotAllowedError' ? 'Microphone permission denied.' : 'Unable to access microphone.'
      }));
    }
  }, [onTranscribed]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
  };
}
