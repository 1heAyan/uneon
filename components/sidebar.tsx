"use client"

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useProModal } from '@/hook/use-pro-modal';
import 'boxicons/css/boxicons.min.css';
import { UserButton } from '@clerk/nextjs';
import { FreeCounter } from './free-counter';
import { ModeToggle } from './mode-toggle';
import { SettingsCenter } from './settings-center';

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const proModal = useProModal();
  const router = useRouter();
  const pathname = usePathname();

  const onNavigate = (url: string, pro: boolean) => {
    if (pro && !isPro) {
      return proModal.onOpen();
    }
    return router.push(url);
  };

  const routes = [
    {
      icon: 'bx bxs-grid-alt', 
      href: '/dashboard',
      color:'text-[#1F72E0]',
    },
    {
      icon: 'bx bxs-chat',
      href: '/conversation',
      color: 'text-[#008080]',
    },
    {
      icon: 'bx bxs-image',
      color: 'text-[#EF5800]',
      href: '/image',
    },
    {
      icon: 'bx bxs-message-dots',
      href: '/ai-companion',
      color: 'text-[#44b75c]',
    },
  ];

  

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-[var(--sidebar)]">
      <div className="p-3 flex-1 flex justify-between flex-col  items-center ">
        <div className="space-y-5 ">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer  rounded-lg transition',
                pathname === route.href ? ' bg-[var(--sidebaract)]' : ''
              )}
            >
              <div className="flex items-center flex-1 ">
                <i className={`${route.icon} ${route.color}`} style={{ fontSize: '1.8rem' }}></i>
              </div>
            </Link>
          ))}
        </div>
        <div className="">
        <FreeCounter  
          apiLimitCount={apiLimitCount} 
          isPro={isPro}
      />
        </div>
        <div className="">
          <SettingsCenter/>
        </div>
      </div>
    </div>
  );
};
