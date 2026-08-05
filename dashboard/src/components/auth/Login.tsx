import React, { useState } from 'react';
import IzoneLogo from '../../images/logo.png';
import { LogIn, Mail, Lock } from 'lucide-react';
import { api } from '../../api/client';

interface LoginProps {
  onLogin: (token: string) => void;
  isLoading?: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu (Số điện thoại)');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      const res = await api.login({ email, phone });
      if (res && res.access_token) {
        onLogin(res.access_token);
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email hoặc Số điện thoại không chính xác');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#18181b] p-4 text-[#404040] dark:text-[#e4e4e7] font-sans selection:bg-[#DB0829]/30">
      <div className="w-full max-w-md bg-white dark:bg-[#27272a] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#3f3f46]">
        {/* Header */}
        <div className="bg-[#f3f4f6] dark:bg-black/20 p-6 flex flex-col items-center border-b border-gray-100 dark:border-[#3f3f46]">
          <img src={IzoneLogo} alt="IZONE" className="h-12 mb-4 dark:brightness-0 dark:invert dark:opacity-90" />
          <h2 className="text-xl font-bold text-center uppercase tracking-wider text-[#404040] dark:text-[#e4e4e7]">
            Hệ thống Quản lý Học viên
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Đăng nhập tài khoản của bạn</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email / Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@izone.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] focus:ring-2 focus:ring-[#DB0829]/50 focus:border-[#DB0829] outline-none transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Mật khẩu (Số điện thoại)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] focus:ring-2 focus:ring-[#DB0829]/50 focus:border-[#DB0829] outline-none transition-all dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#DB0829] hover:bg-[#b00620] text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {(isLoading || isSubmitting) ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {(isLoading || isSubmitting) ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};
