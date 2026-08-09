import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { HiOutlineArrowLeft, HiOutlineKey, HiOutlineMail, HiOutlineX } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: request OTP, 2: verify OTP & reset
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter email and password');
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'super_admin') {
        navigate('/super-admin');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/manager');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.error('Please enter your staff email');
    setResetLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: resetEmail });
      toast.success(res.data.message || 'OTP code sent to email', { duration: 6000 });
      if (res.data.otp) {
        setOtpCode(res.data.otp);
      }
      setForgotStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request reset OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otpCode || !newPassword) return toast.error('Please enter the OTP code and new password');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    setResetLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email: resetEmail,
        otp: otpCode,
        newPassword
      });
      toast.success(res.data.message || 'Password reset successfully!');
      setEmail(resetEmail);
      setPassword(newPassword);
      setShowForgotModal(false);
      setForgotStep(1);
      setOtpCode('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  const inputBase = 'w-full bg-transparent border-b text-base text-ink py-3 focus:outline-none transition-colors duration-300 placeholder:text-stone/50 border-stone/30 focus:border-forest';

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-20 animate-fade-in">
      <div className="w-full max-w-md bg-white/80 border border-stone/15 rounded-3xl p-8 sm:p-12 shadow-xs backdrop-blur-xs">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-12 group">
          <span className="font-heading text-2xl text-ink">Hira Agro</span>
          <span className="text-[10px] tracking-[0.15em] font-semibold uppercase text-gold mt-1">Industry</span>
        </Link>

        {/* Heading */}
        <span className="block text-xs tracking-[0.25em] uppercase text-gold font-semibold mb-3">STAFF PORTAL</span>
        <h1 className="font-heading text-4xl text-ink mb-2">Sign in</h1>
        <p className="text-stone text-sm mb-10">Admin and manager access only</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs tracking-[0.1em] uppercase text-stone font-semibold mb-3">Staff ID / Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin  or  hiraagroindustry51@gmail.com"
              required
              className={inputBase}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs tracking-[0.1em] uppercase text-stone font-semibold">Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-xs text-forest hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputBase}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-forest text-cream py-4 rounded-full text-sm tracking-wide font-semibold transition-all duration-300 hover:bg-primary-light shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.97]"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin mx-auto"></div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-stone/15 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone hover:text-ink transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in relative shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 text-stone hover:text-ink p-1 rounded-full"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            {forgotStep === 1 ? (
              <div>
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 text-forest">
                  <HiOutlineMail className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl text-ink mb-1">Reset Password</h3>
                <p className="text-stone text-xs mb-6">
                  Enter your registered staff email address to receive a 6-digit OTP code.
                </p>
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Staff Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="hiraagroindustry51@gmail.com"
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-forest text-cream py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
                  >
                    {resetLoading ? 'Sending OTP...' : 'Send Reset OTP Code'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-forest">
                  <HiOutlineKey className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl text-ink mb-1">Enter OTP & New Password</h3>
                <p className="text-stone text-xs mb-6">
                  We sent a 6-digit OTP code to <strong className="text-ink">{resetEmail}</strong>.
                </p>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">6-Digit OTP Code</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      maxLength="6"
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest tracking-widest font-mono text-center font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                      min="6"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="flex-1 py-3 border border-stone/20 rounded-full text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-forest text-cream py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
                    >
                      {resetLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
