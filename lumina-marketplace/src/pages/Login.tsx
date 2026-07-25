import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { useAuthStore, UserRole } from '../store/authStore';
import { Button, Input } from '../components/ui/DesignComponents';

export const Login: React.FC = () => {
  const { loginWithEmail, loginWithPhone, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'email' | 'otp' | 'register'>('email');
  const [email, setEmail] = useState('amir.rad@shopino.ir');
  const [password, setPassword] = useState('shopino2026');
  const [phone, setPhone] = useState('09123456789');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [roleSelect, setRoleSelect] = useState<UserRole>('user');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email, roleSelect);
    navigate('/');
  };

  const handleSendOtp = () => {
    if (phone.length < 11) return;
    setOtpSent(true);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPhone(phone, 'کاربر شاپینو');
    navigate('/');
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'admin') {
      loginWithEmail('admin@shopino.ir', 'admin');
    } else if (role === 'seller') {
      loginWithEmail('seller@shopino.ir', 'seller');
    } else {
      loginWithEmail('amir.rad@shopino.ir', 'user');
    }
    navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
              <Store size={28} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            ورود به حساب شاپینو
          </h1>
          <p className="text-xs text-gray-500">
            برای تجربه خرید یا فروش هوشمندانه در بزرگترین بازار کالا وارد شوید
          </p>
        </div>

        {/* Quick Demo Login Cards (Enterprise Portfolio helper) */}
        <div className="bg-purple-100/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-3xl p-4 space-y-2.5">
          <p className="text-[11px] font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-purple-600" />
            دسترسی سریع تستی نمونه‌کار (با یک کلیک):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('user')}
              className="py-2 px-2 rounded-xl bg-white dark:bg-gray-800 hover:bg-purple-600 hover:text-white text-gray-800 dark:text-gray-200 text-xs font-bold transition shadow-sm border border-gray-200 dark:border-gray-700"
            >
              👤 کاربر خریدار
            </button>
            <button
              onClick={() => handleQuickDemoLogin('seller')}
              className="py-2 px-2 rounded-xl bg-white dark:bg-gray-800 hover:bg-purple-600 hover:text-white text-gray-800 dark:text-gray-200 text-xs font-bold transition shadow-sm border border-gray-200 dark:border-gray-700"
            >
              💼 فروشنده کالا
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-2 px-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-xs font-bold transition shadow-md shadow-purple-500/20"
            >
              🛡️ ادمین کل
            </button>
          </div>
        </div>

        {/* Main Form Box */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          {/* Method tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {[
              { id: 'email', label: '📧 ورود با ایمیل' },
              { id: 'otp', label: '📱 کد یک‌بارمصرف (OTP)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex-1 py-4 text-xs font-bold transition border-b-2 -mb-px ${
                  tab === t.id
                    ? 'border-purple-600 text-purple-600 bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-500 bg-gray-50 dark:bg-gray-800 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* TAB 1: EMAIL & PASSWORD */}
            {tab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  label="آدرس ایمیل"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  leftIcon={<Mail size={16} />}
                  required
                />

                <div className="relative">
                  <Input
                    label="رمز عبور"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock size={16} />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-10 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Role select */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    ورود به عنوان:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'user', label: 'خریدار کالا' },
                      { id: 'seller', label: 'فروشنده' },
                      { id: 'admin', label: 'ادمین کل' }
                    ].map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRoleSelect(r.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition ${
                          roleSelect === r.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full py-4 text-sm mt-4">
                  ورود به حساب کاربری
                </Button>
              </form>
            )}

            {/* TAB 2: MOBILE OTP */}
            {tab === 'otp' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <div className="space-y-4">
                    <Input
                      label="شماره موبایل فعال"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912xxxxxxx"
                      leftIcon={<Smartphone size={16} />}
                    />
                    <Button
                      onClick={handleSendOtp}
                      disabled={phone.length < 11}
                      className="w-full py-4 text-sm"
                    >
                      ارسال کد تایید پیامکی (OTP)
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-xs text-purple-900 dark:text-purple-300 flex items-center justify-between">
                      <span>کد تایید به {phone} ارسال شد</span>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="font-bold underline"
                      >
                        ویرایش
                      </button>
                    </div>
                    <Input
                      label="کد ۴ رقمی تایید (تست: 1234)"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="----"
                      className="text-center font-mono tracking-widest text-lg"
                      autoFocus
                    />
                    <Button type="submit" className="w-full py-4 text-sm">
                      تایید و ورود
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* Social / Google separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
              <span className="flex-shrink mx-4 text-xs text-gray-400">یا ورود سریع با</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
            </div>

            <button
              onClick={() => {
                loginWithGoogle();
                navigate('/');
              }}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4"
              />
              <span>ورود با حساب گوگل (Google Login)</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          با ورود به شاپینو،{' '}
          <Link to="/" className="text-purple-600 hover:underline">
            قوانین و شرایط حریم خصوصی
          </Link>{' '}
          را می‌پذیرید.
        </p>
      </div>
    </div>
  );
};

export default Login;
