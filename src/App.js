import React, { useState, useRef } from "react";

const App = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      setAudioBlob(audioBlob);
      console.log("Audio recorded:", audioBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await fetch(
        "https://your-backend-url.com/api/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Transcript:", data.transcript);
      // You can now setTranscript(data.transcript) or whatever you need
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div>
      <h1>Healthcare Translator (Whisper)</h1>
      {!recording ? (
        <button onClick={startRecording}>🎙️ Start Recording</button>
      ) : (
        <button onClick={stopRecording}>⏹️ Stop Recording</button>
      )}

      {audioBlob && (
        <div>
          <p>Audio recorded! Ready to upload.</p>
          <button onClick={handleUpload}>📤 Upload to Whisper</button>
        </div>
      )}
    </div>
  );
};

export default App;
