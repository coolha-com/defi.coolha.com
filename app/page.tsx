
'use client';

import { FaWallet, FaChartLine, FaCoins, FaShieldAlt, FaRocket, FaUsers } from 'react-icons/fa';
import { BiTrendingUp, BiLock, BiGlobe } from 'react-icons/bi';
import { MdAccountBalanceWallet, MdSecurity, MdSpeed } from 'react-icons/md';
import { formatCurrency, formatLargeNumber } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { FaBitcoin } from 'react-icons/fa6';

export default function Home() {
  return (
    <div className="bg-base-100 overflow-hidden">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/15 relative">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="hero-content text-center relative z-10">
          <div className="max-w-4xl">
            {/* Logo动画容器 */}
             <div className="mb-8 relative">
               <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
              <Image
                src="/logo/头像LOGO图.png"
                alt="Coolha Logo"
                width={120}
                height={120}
                className="relative z-10 mx-auto rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* 主标题 */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              Coolha DeFi
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-base-content/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              🚀 下一代去中心化金融平台
              <br />
              <span className="text-lg text-base-content/60">安全 • 高效 • 创新</span>
            </p>
            
            {/* 统计数据 */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
               <div className="bg-base-100 backdrop-blur-sm rounded-2xl p-6 border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20">
                 <div className="text-3xl font-bold text-primary mb-2">$1.478B+</div>
                 <div className="text-base-content/70">总锁定价值</div>
               </div>
               <div className="bg-base-100 backdrop-blur-sm rounded-2xl p-6 border border-secondary/30 hover:border-secondary/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-secondary/20">
                 <div className="text-3xl font-bold text-secondary mb-2">200+</div>
                 <div className="text-base-content/70">市场数量</div>
               </div>
               <div className="bg-base-100 backdrop-blur-sm rounded-2xl p-6 border border-accent/30 hover:border-accent/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent/20">
                 <div className="text-3xl font-bold text-accent mb-2">98.5%</div>
                 <div className="text-base-content/70">系统稳定性</div>
               </div>
             </div>
            
            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/earn" className="btn btn-primary btn-lg gap-3 px-8 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary/25">
                <FaCoins className="text-xl" />
                赚取收益
              </Link>
              <Link href="/borrow" className="btn btn-outline btn-lg gap-3 px-8 hover:scale-105 transition-transform duration-300 shadow-lg">
                <FaBitcoin className="text-xl" />
                抵押借贷
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 特性展示区域 */}
       <div className="py-20 bg-gradient-to-b from-base-200/50 to-base-300/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              为什么选择 Coolha DeFi？
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              我们提供最安全、最高效的去中心化金融服务
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 安全性 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-primary/10">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <FaShieldAlt className="text-2xl text-primary" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">🔒 极致安全</h3>
                <p className="text-base-content/70">
                  多重安全审计，智能合约保障，资金安全无忧
                </p>
              </div>
            </div>
            
            {/* 高收益 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-secondary/10">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <BiTrendingUp className="text-2xl text-secondary" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">📈 高收益率</h3>
                <p className="text-base-content/70">
                  优化的收益策略，让您的资产获得最大化收益
                </p>
              </div>
            </div>
            
            {/* 快速便捷 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-accent/10">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <MdSpeed className="text-2xl text-accent" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">⚡ 快速便捷</h3>
                <p className="text-base-content/70">
                  一键操作，即时到账，简化您的DeFi体验
                </p>
              </div>
            </div>
            
            {/* 透明公开 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-primary/10">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <BiGlobe className="text-2xl text-primary" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">🌐 透明公开</h3>
                <p className="text-base-content/70">
                  所有交易链上可查，完全去中心化，无需信任第三方
                </p>
              </div>
            </div>
            
            {/* 社区驱动 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-secondary/10">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <FaUsers className="text-2xl text-secondary" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">👥 社区驱动</h3>
                <p className="text-base-content/70">
                  由社区治理，共同决策，打造真正的去中心化平台
                </p>
              </div>
            </div>
            
            {/* 创新技术 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-accent/10">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <FaRocket className="text-2xl text-accent" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">🚀 创新技术</h3>
                <p className="text-base-content/70">
                  采用最新DeFi技术，持续创新，引领行业发展
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA区域 */}
       <div className="py-20 bg-gradient-to-r from-primary/15 to-secondary/15">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            准备开始您的DeFi之旅？
          </h2>
          <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            加入数万用户，体验下一代去中心化金融服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/earn" className="btn btn-primary btn-lg gap-3 px-8 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary/25">
              <FaCoins className="text-xl" />
              立即开始赚取
            </Link>
            <Link href="/borrow" className="btn btn-secondary btn-lg gap-3 px-8 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-secondary/25">
              <FaWallet className="text-xl" />
              了解借贷服务
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
