'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWallet, FaBars } from 'react-icons/fa';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import ConnectWallet from '../ui/ConnectWallet';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/swap', label: '交换' },
    { href: '/borrow', label: '借贷' },
    { href: '/pools', label: '流动性' },
    { href: '/farms', label: '农场' },
    { href: '/analytics', label: '数据' },
  ];

  return (
    <div className={cn('navbar bg-base-100 shadow-lg', className)}>
      <div className="navbar-start">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <FaBars />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-base-content"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logo */}
        <Link href="/" className="hidden md:flex btn btn-ghost text-xl font-bold">
          <Image
            src="/logo/透明LOGO绿色.png"
            alt="Coolha Logo"
            width={32}
            height={32}
          />
          Coolha DeFi
        </Link>

        <Link href="/" className="flex md:hidden btn btn-ghost btn-circle text-xl font-bold">
          <Image
            src="/logo/透明LOGO绿色.png"
            alt="Coolha Logo"
            width={32}
            height={32}
          />
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-base-content transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Theme toggle and Connect wallet button */}
      <div className="navbar-end gap-2">
        <ThemeToggle />
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;