'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-base-200 rounded-lg">
          <div className="text-error text-xl mb-4">⚠️ 网络连接出现问题</div>
          <p className="text-base-content/70 mb-4 text-center">
            {this.state.error?.message?.includes('timeout') 
              ? '请求超时，请检查网络连接'
              : '加载数据时出现错误，请稍后重试'
            }
          </p>
          <button 
            onClick={this.retry}
            className="btn btn-primary"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook版本的错误边界
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      // 可以在这里添加错误报告逻辑
    }
  }, [error]);

  return { error, resetError, handleError };
}

// 网络错误处理组件
export function NetworkErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  const isTimeoutError = error?.message?.includes('timeout') || error?.message?.includes('TimeoutError');
  const isNetworkError = error?.message?.includes('fetch') || error?.message?.includes('network');

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-base-200 rounded-lg border border-base-300">
      <div className="text-warning text-2xl mb-3">🌐</div>
      <h3 className="text-lg font-semibold mb-2">
        {isTimeoutError ? '连接超时' : isNetworkError ? '网络错误' : '加载失败'}
      </h3>
      <p className="text-base-content/70 mb-4 text-center text-sm">
        {isTimeoutError 
          ? '请求响应时间过长，请检查网络连接状态'
          : isNetworkError 
          ? '无法连接到服务器，请检查网络设置'
          : '数据加载失败，请稍后重试'
        }
      </p>
      <div className="flex gap-2">
        <button 
          onClick={retry}
          className="btn btn-primary btn-sm"
        >
          重新加载
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-ghost btn-sm"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}