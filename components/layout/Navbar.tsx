'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWallet, FaBars } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import ConnectWallet from '../ui/ConnectWallet';
import ChainSwitcher from '../ui/ChainSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {

  const navItems = [
    { href: '/earn', label: '赚取' },
    { href: '/borrow', label: '借贷' },
  ];

  return (
    <div className={cn('navbar bg-base-100 shadow-lg fixed top-0 w-full z-50', className)}>
      <div className="navbar-start">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <FaBars />
          </div>
          <ul
            tabIndex={0}
            className="menu  dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
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
            <li>  <ThemeToggle /></li>
          </ul>
        </div>

        {/* Logo */}
        <Link href="/" className="hidden md:flex btn btn-ghost text-xl font-bold ">
          <Image
            src="/favicon.ico"
            alt="Coolha Logo"
            width={32}
            height={32}
            className=' rounded-full'
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


        {/* Desktop menu */}
        <div className=" hidden lg:flex">
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
      </div>



      {/* Theme toggle and Connect wallet button */}
      <div className="navbar-end gap-2">
        <div className='hidden md:block'><ThemeToggle /></div>

        <ChainSwitcher />
        <ConnectWallet />
      </div>
    </div>
  );
};
