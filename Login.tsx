
import React, { useEffect } from 'react';
import { UserProfile } from '../types';
import { LogIn, GraduationCap, ShieldCheck, Cloud } from 'lucide-react';

// Fix: Declare global 'google' variable for Google Identity Services SDK
declare const google: any;

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  useEffect(() => {
    // Check if the google SDK is loaded from the script tag in index.html
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // This would be replaced by actual ID
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: 280, shape: "pill" }
      );
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    // Decoding JWT (simplified for demo/mock)
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    
    const user: UserProfile = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      university: "Central University" // Default placeholder
    };
    
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
          <GraduationCap size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">UniFlow</h1>
        <p className="text-gray-400 font-medium max-w-[240px] mx-auto">Your academic journey, synced across all your devices.</p>
      </div>

      <div className="space-y-6 w-full max-w-xs">
        <div className="space-y-4">
          <div id="googleBtn" className="flex justify-center"></div>
          {/* Fallback for preview environment if Google GSI doesn't load */}
          <button 
            onClick={() => onLogin({ id: 'mock-123', email: 'student@uni.edu', name: 'Demo Student', university: 'Harvard University' })}
            className="w-full py-4 px-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-3 font-bold text-gray-700 active:scale-95 transition-all"
          >
            <LogIn size={20} className="text-blue-600" />
            Sign in with Google
          </button>
        </div>

        <div className="pt-8 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-green-50 p-3 rounded-full text-green-600">
              <Cloud size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Cloud Sync</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Secure Data</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest absolute bottom-12">
        Version 2.0 • Secured by Google
      </p>
    </div>
  );
};

export default Login;
