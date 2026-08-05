import React from 'react';

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}

/**
 * Tiêu đề section dùng chung cho card biểu đồ/bảng. Trước đây mỗi nơi tự vẽ
 * dải nền xám + viền trái đỏ (kiểu admin template cũ) — bỏ hết, chỉ còn viền
 * dưới mỏng để phân tách với nội dung bên dưới.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon, right }) => (
  <div className="px-5 py-4 border-b border-[#f3f4f6] dark:border-[#3f3f46] flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] mt-1">{subtitle}</p>
      )}
    </div>
    {right}
  </div>
);
