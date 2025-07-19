
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
      <div className="hero min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-7xl font-bold bg-primary text-black">Coolha DeFi</h1>
            <p className="py-6 text-base-content">
              一个仅针对去中心化金融服务的平台
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


    </div>
  );
}
