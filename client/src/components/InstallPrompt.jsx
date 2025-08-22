// src/components/InstallPrompt.jsx
import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
const [deferredPrompt, setDeferredPrompt] = useState(null);

useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
}, [ deferredPrompt, setDeferredPrompt]);

const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
    console.log('کاربر نصب کرد.');
    }
    setDeferredPrompt(null);
};

if (!deferredPrompt) return null;

return (
    <div className="fixed z-50 p-4 text-white bg-blue-600 rounded-lg shadow-lg bottom-4 left-4">
    <p className="mb-2">اپلیکیشن FitTrack رو نصب کنید!</p>
    <button
        onClick={handleInstallClick}
        className="px-4 py-1 text-sm font-medium text-blue-600 bg-white rounded"
    >
        نصب اپ
    </button>
    </div>
);
};

export default InstallPrompt;