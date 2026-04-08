import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export function Login() {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-emerald-950 text-emerald-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-amber-400"
      >
        Welcome to SciConnect
      </motion.h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={signInWithGoogle}
        className="flex items-center gap-2 bg-amber-600 text-emerald-950 px-6 py-3 rounded-full text-lg font-semibold"
      >
        <LogIn size={24} />
        Sign in with Google
      </motion.button>
    </div>
  );
}
