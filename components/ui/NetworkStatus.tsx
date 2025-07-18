'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';

interface NetworkStatusProps {
  className?: string;
}

export default function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');
  const { isConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionQuality('good');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('offline');
    };

    // 检测网络连接状态
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始状态检查
    setIsOnline(navigator.onLine);

    // 定期检查连接质量
    const checkConnectionQuality = async () => {
      if (!navigator.onLine) {
        setConnectionQuality('offline');
        return;
      }

      try {
        const start = Date.now();
        const response = await fetch('/api/health', {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        const duration = Date.now() - start;

        if (response.ok) {
          setConnectionQuality(duration > 2000 ? 'poor' : 'good');
        } else {
          setConnectionQuality('poor');
        }
      } catch (error) {
        setConnectionQuality('poor');
      }
    };

    // 每30秒检查一次连接质量
    const interval = setInterval(checkConnectionQuality, 30000);
    checkConnectionQuality(); // 立即检查一次

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = () => {
    switch (connectionQuality) {
      case 'good':
        return 'text-success';
      case 'poor':
        return 'text-warning';
      case 'offline':
        return 'text-error';
      default:
        return 'text-base-content';
    }
  };

  const getStatusIcon = () => {
    switch (connectionQuality) {
      case 'good':
        return '🟢';
      case 'poor':
        return '🟡';
      case 'offline':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusText = () => {
    if (!isConnected) return '未连接钱包';
    
    switch (connectionQuality) {
      case 'good':
        return '网络正常';
      case 'poor':
        return '网络较慢';
      case 'offline':
        return '网络离线';
      default:
        return '检查中...';
    }
  };

  const getChainName = () => {
    switch (chainId) {
      case 1:
        return 'Ethereum';
      case 8453:
        return 'Base';
      case 137:
        return 'Polygon';
      case 10:
        return 'Optimism';
      case 1301:
        return 'Unichain';
      default:
        return `Chain ${chainId}`;
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span className="text-lg">{getStatusIcon()}</span>
      <div className="flex flex-col">
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {isConnected && (
          <span className="text-xs opacity-70">
            {getChainName()}
          </span>
        )}
      </div>
    </div>
  );
}

// 简化版本的网络状态指示器
export function NetworkIndicator({ className = '' }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const { isConnected } = useAccount();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isConnected || isOnline) return null;

  return (
    <div className={`alert alert-warning shadow-lg ${className}`}>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>网络连接已断开，某些功能可能无法正常使用</span>
      </div>
    </div>
  );
}