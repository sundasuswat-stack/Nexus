import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  Lock, Shield, CheckCircle, XCircle, Eye, EyeOff, Smartphone
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const { user } = useAuth();

  // Password strength state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password strength calculation
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-error-500', 'bg-error-500', 'bg-accent-500', 'bg-accent-500', 'bg-success-500', 'bg-success-500'];
  const strengthLabel = password ? strengthLabels[strength] : '';
  const strengthColor = strengthColors[strength];

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    if (otp.every((digit) => digit !== '')) {
      setOtpVerified(true);
      setTimeout(() => {
        setTwoFAEnabled(true);
        setShowOtpModal(false);
        setOtpVerified(false);
        setOtp(['', '', '', '', '', '']);
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Security & Access</h1>
        <p className="text-gray-500 mt-1">
          Manage your password, two-factor authentication, and account role.
        </p>
      </div>

      {/* Account Role Card */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center">
            <Shield size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-semibold text-gray-900">
              {user?.name || 'User'}{' '}
              <Badge variant={user?.role === 'investor' ? 'secondary' : 'primary'}>
                {user?.role === 'investor' ? 'Investor' : 'Entrepreneur'}
              </Badge>
            </p>
          </div>
        </div>
      </Card>

      {/* Password Strength Meter */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <div className="relative mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div className="mb-4">
            <div className="flex gap-1 mb-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < strength ? strengthColor : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-medium ${
              strength <= 1 ? 'text-error-500' : strength <= 3 ? 'text-accent-600' : 'text-success-500'
            }`}>
              {strengthLabel}
            </p>
          </div>
        )}

        {/* Requirements checklist */}
        <div className="space-y-1.5 mb-4">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {req.met ? (
                <CheckCircle size={15} className="text-success-500" />
              ) : (
                <XCircle size={15} className="text-gray-300" />
              )}
              <span className={req.met ? 'text-gray-700' : 'text-gray-400'}>{req.label}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" disabled={strength < 3}>
          Update Password
        </Button>
      </Card>

      {/* 2FA Section */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-secondary-50 flex items-center justify-center">
              <Smartphone size={20} className="text-secondary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Two-Factor Authentication (2FA)</h2>
              <p className="text-sm text-gray-500">
                Add an extra layer of security using a one-time code.
              </p>
            </div>
          </div>

          {twoFAEnabled ? (
            <Badge variant="success">Enabled</Badge>
          ) : (
            <Button variant="secondary" onClick={() => setShowOtpModal(true)}>
              Enable 2FA
            </Button>
          )}
        </div>
      </Card>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="p-6 w-full max-w-sm text-center">
            {!otpVerified ? (
              <>
                <div className="w-14 h-14 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-3">
                  <Smartphone size={26} className="text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Verify Your Device</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Enter the 6-digit code sent to your phone
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ))}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button variant="ghost" onClick={() => setShowOtpModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    disabled={otp.some((d) => d === '')}
                    onClick={verifyOtp}
                  >
                    Verify
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={28} className="text-success-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Verified!</h3>
                <p className="text-sm text-gray-500 mt-1">2FA is now enabled on your account.</p>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};