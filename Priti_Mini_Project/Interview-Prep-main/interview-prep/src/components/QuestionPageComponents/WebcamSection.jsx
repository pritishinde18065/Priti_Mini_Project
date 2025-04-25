import React, { useState, useRef } from 'react';
import { Video, VideoOff, Camera, StopCircle, Download, X } from 'lucide-react';

const WebcamSection = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [streamActive, setStreamActive] = useState(false); // Track if the webcam is on
  const videoRef = useRef(null);
  const chunksRef = useRef([]); 

  // Start the webcam and recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      chunksRef.current = []; 
      setStreamActive(true); // Webcam is now active

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setShowSavePrompt(true);
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting webcam recording:", error);
    }
  };

  // Stop the recording and the webcam stream
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setStreamActive(false); // Webcam is now off
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  // Handle saving the recording to the user's computer
  const handleSaveRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `interview_${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      setRecordedBlob(null);
      setShowSavePrompt(false);
    }
  };

  // Discard the recorded video if the user cancels
  const handleDiscardRecording = () => {
    setRecordedBlob(null);
    setShowSavePrompt(false);
  };

  return (
    <div className="hidden md:flex md:w-1/3 w-full flex-col items-center">
      <div
        className="hidden md:flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg relative"
        style={{ width: 300, height: 200 }}
      >
        {/* Video Preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover rounded-xl transform scale-x-[-1] ${
            !streamActive ? "hidden" : "" // Hide video when webcam is off
          }`}
        />

        {/* Show Camera Off Icon if the webcam is off */}
        {!streamActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <VideoOff size={60} />
            <p className="mt-2 text-sm">Camera Off</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition-transform duration-300 transform hover:scale-105"
          >
            <Video className="mr-2" size={20} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-transform duration-300 transform hover:scale-105"
          >
            <StopCircle className="mr-2" size={20} />
            Stop Recording
          </button>
        )}
      </div>

      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/3 text-center">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <Camera className="mr-2" size={24} />
              Save Recording
            </h3>
            <p className="mb-4 text-gray-600">
              Would you like to save your interview recording to your computer?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDiscardRecording}
                className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-full"
              >
                <X className="mr-2" size={18} />
                Cancel
              </button>
              <button
                onClick={handleSaveRecording}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition-transform duration-300 transform hover:scale-105"
              >
                <Download className="mr-2" size={18} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamSection;
