'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTokenLogoUrl, getTokenFallbackColor } from '@/config/tokenLogos';

interface TokenIconProps {
  symbol: string;
  address?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// 尺寸映射
const SIZE_CLASSES = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12'
};

// 文字尺寸映射
const TEXT_SIZE_CLASSES = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base'
};

export default function TokenIcon({ symbol, address, size = 'md', className = '' }: TokenIconProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  
  const logoUrls = getTokenLogoUrl(symbol, address);
  const fallbackColor = getTokenFallbackColor(symbol);
  const sizeClass = SIZE_CLASSES[size];
  const textSizeClass = TEXT_SIZE_CLASSES[size];
  
  // 重置状态当symbol或address改变时
  useEffect(() => {
    setCurrentUrlIndex(0);
    setIsLoading(true);
    setShowFallback(false);
  }, [symbol, address]);
  
  // 处理图片加载错误，尝试下一个URL
  const handleImageError = () => {
    if (currentUrlIndex < logoUrls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
      setIsLoading(true);
    } else {
      setShowFallback(true);
      setIsLoading(false);
    }
  };
  
  // 处理图片加载成功
  const handleImageLoad = () => {
    setIsLoading(false);
    setShowFallback(false);
  };
  
  // 如果没有可用的URL或者所有URL都失败了，显示fallback
  if (logoUrls.length === 0 || showFallback) {
    return (
      <div 
        className={`${sizeClass} rounded-full flex items-center justify-center ${className}`}
        style={{ 
          background: `linear-gradient(135deg, ${fallbackColor}, ${fallbackColor}dd)` 
        }}
      >
        <span className={`${textSizeClass} font-bold text-white`}>
          {symbol.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }
  
  const currentUrl = logoUrls[currentUrlIndex];
  
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-base-200 flex items-center justify-center relative ${className}`}>
      {/* Loading fallback */}
      {isLoading && (
        <div 
          className={`${sizeClass} rounded-full flex items-center justify-center absolute inset-0 z-10`}
          style={{ 
            background: `linear-gradient(135deg, ${fallbackColor}, ${fallbackColor}dd)` 
          }}
        >
          <span className={`${textSizeClass} font-bold text-white`}>
            {symbol.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      
      {/* 实际图片 */}
      <Image
        key={`${symbol}-${currentUrlIndex}`} // 强制重新渲染当URL改变时
        src={currentUrl}
        alt={`${symbol} logo`}
        width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48}
        className={`${sizeClass} rounded-full object-cover transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        unoptimized // 允许外部图片
      />
    </div>
  );
}