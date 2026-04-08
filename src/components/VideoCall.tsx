import React, { useRef, useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function VideoCall({ onClose }: { onClose: () => void }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCall() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s;
        }
        setStream(s);
      } catch (err) {
        console.error('Error starting video call:', err);
      }
    }
    startCall();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      
      {/* Local Preview */}
      <div className="absolute top-4 right-4 w-32 h-48 bg-emerald-900 rounded-lg overflow-hidden border-2 border-amber-400 shadow-lg">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      </div>

      <div className="absolute bottom-8 flex gap-6 bg-emerald-950/80 p-4 rounded-full backdrop-blur-sm border border-emerald-700">
        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleMute} className={cn("p-4 rounded-full transition-colors", isMuted ? "bg-red-600" : "bg-emerald-700 hover:bg-emerald-600")}>
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="bg-red-600 p-4 rounded-full hover:bg-red-500 transition-colors">
          <PhoneOff size={24} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleVideo} className={cn("p-4 rounded-full transition-colors", isVideoOff ? "bg-red-600" : "bg-emerald-700 hover:bg-emerald-600")}>
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </motion.button>
      </div>
    </div>
  );
}
