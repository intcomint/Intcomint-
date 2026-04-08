import React, { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon, SwitchCamera } from 'lucide-react';
import { motion } from 'motion/react';

export function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setStream(s);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="relative h-screen bg-black">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
      <div className="absolute bottom-20 w-full flex justify-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => alert('Camera functionality coming soon!')}
          className="bg-white p-6 rounded-full border-4 border-emerald-500"
        >
          <CameraIcon size={32} className="text-emerald-950" />
        </motion.button>
      </div>
    </div>
  );
}
