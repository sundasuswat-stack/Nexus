import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare,
  MessageSquare, Users, Phone
} from 'lucide-react';

export const VideoCallPage: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = () => {
    setInCall(true);
    setCallDuration(0);
    intervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    setInCall(false);
    setScreenSharing(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
        <p className="text-gray-500 mt-1">
          Connect face-to-face with investors and entrepreneurs.
        </p>
      </div>

      {!inCall ? (
        // Pre-call screen
        <Card className="p-8 max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <Users size={40} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to start your call?
          </h2>
          <p className="text-gray-500 mb-6">
            Your camera and microphone are off. Click below to join.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-4 rounded-full ${micOn ? 'bg-gray-100 text-gray-700' : 'bg-error-50 text-error-500'}`}
            >
              {micOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-4 rounded-full ${videoOn ? 'bg-gray-100 text-gray-700' : 'bg-error-50 text-error-500'}`}
            >
              {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
          </div>
          <Button variant="success" size="lg" leftIcon={<Phone size={18} />} onClick={startCall}>
            Start Call
          </Button>
        </Card>
      ) : (
        // In-call screen
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900 rounded-lg overflow-hidden relative" style={{ height: '500px' }}>
            {/* Main video area (remote participant mock) */}
            <div className="w-full h-full flex items-center justify-center">
              {screenSharing ? (
                <div className="text-white text-center">
                  <ScreenShare size={48} className="mx-auto mb-2 text-primary-400" />
                  <p className="text-gray-300">You are sharing your screen</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-secondary-600 flex items-center justify-center mx-auto mb-3 text-white text-3xl font-semibold">
                    MR
                  </div>
                  <p className="text-white font-medium">Michael Rodriguez</p>
                  <p className="text-gray-400 text-sm">Investor</p>
                </div>
              )}
            </div>

            {/* Call duration badge */}
            <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {formatDuration(callDuration)}
            </div>

            {/* Self video (small preview, mock) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 bg-gray-800 rounded-md border-2 border-gray-700 flex items-center justify-center">
              {videoOn ? (
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  You
                </div>
              ) : (
                <VideoOff size={20} className="text-gray-500" />
              )}
            </div>
          </div>

          {/* Call controls */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-4 rounded-full transition-colors ${
                micOn ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-error-500 text-white hover:bg-error-700'
              }`}
              title={micOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {micOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-4 rounded-full transition-colors ${
                videoOn ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-error-500 text-white hover:bg-error-700'
              }`}
              title={videoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-4 rounded-full transition-colors ${
                screenSharing ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Share screen"
            >
              <ScreenShare size={22} />
            </button>

            <button
              className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="Chat"
            >
              <MessageSquare size={22} />
            </button>

            <button
              onClick={endCall}
              className="p-4 rounded-full bg-error-500 text-white hover:bg-error-700 transition-colors"
              title="End call"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};