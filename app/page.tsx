
'use client';

import { FaWallet, FaChartLine, FaCoins } from 'react-icons/fa';
import { BiTrendingUp } from 'react-icons/bi';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { formatCurrency, formatLargeNumber } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-7xl font-bold text-primary">Coolha DeFi</h1>
            <p className="py-6 text-base-content">
              Coolha DeFi 是一个仅针对去中心化金融服务的平台
            </p>
            <Link href={`/earn`} className="btn btn-primary btn-lg gap-2 m-2">
              开始赚取
            </Link>
            <Link href={`/borrow`} className="btn btn-primary btn-lg gap-2 m-2">
              抵押借贷
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-base-content">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <FaCoins className="text-4xl text-primary mb-4" />
              <h3 className="card-title text-primary">代币交换</h3>
              <p className="text-base-content">快速、安全的去中心化代币交换服务</p>
              <div className="card-actions">
                <button className="btn btn-secondary">开始交换</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <FaChartLine className="text-4xl text-info mb-4" />
              <h3 className="card-title text-info">流动性挖矿</h3>
              <p className="text-base-content">提供流动性获得丰厚收益回报</p>
              <div className="card-actions">
                <button className="btn btn-info">查看池子</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <BiTrendingUp className="text-4xl text-success mb-4" />
              <h3 className="card-title text-success">收益农场</h3>
              <p className="text-base-content">质押代币获得持续被动收入</p>
              <div className="card-actions">
                <button className="btn btn-success">开始质押</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <MdAccountBalanceWallet className="text-3xl" />
              </div>
              <div className="stat-title">总锁仓价值</div>
              <div className="stat-value text-primary">{formatCurrency(89400)}</div>
              <div className="stat-desc">21% 比上月增长</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <FaCoins className="text-3xl" />
              </div>
              <div className="stat-title">活跃用户</div>
              <div className="stat-value text-secondary">{formatLargeNumber(2600)}</div>
              <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-info">
                <BiTrendingUp className="text-3xl" />
              </div>
              <div className="stat-title">24小时交易量</div>
              <div className="stat-value text-info">{formatLargeNumber(1200)}</div>
              <div className="stat-desc">↘︎ 90 (14%)</div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
