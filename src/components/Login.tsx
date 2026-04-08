import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { LogIn, Phone, ShieldCheck } from 'lucide-react';

export function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const onSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      alert('Verification code sent!');
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS. Make sure the number is in international format (e.g., +966...)');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Invalid code!');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-emerald-950 text-emerald-100 p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-amber-400 text-center"
      >
        مرحباً بك في بن مرشد
      </motion.h1>

      <div className="w-full max-w-md space-y-6 bg-emerald-900/50 p-8 rounded-2xl border border-emerald-700">
        {!confirmationResult ? (
          <form onSubmit={onSignInSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-emerald-400">رقم الجوال (مع رمز الدولة)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input
                  type="tel"
                  placeholder="+966500000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-emerald-800 border border-emerald-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-emerald-950 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-emerald-400">رمز التحقق (OTP)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full bg-emerald-800 border border-emerald-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmationResult(null)}
              className="w-full text-emerald-400 text-sm hover:underline"
            >
              تغيير رقم الجوال
            </button>
          </form>
        )}

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-emerald-700"></div>
          <span className="flex-shrink mx-4 text-emerald-500 text-sm">أو</span>
          <div className="flex-grow border-t border-emerald-700"></div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          تسجيل الدخول عبر جوجل
        </button>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
}
