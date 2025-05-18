'use client'
import React from 'react';
import { FaRegBell } from 'react-icons/fa';

export default function NotificationBell({ hasNotification = false, onClick }: { hasNotification?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="relative cursor-pointer">
      {hasNotification && (
        <div className="absolute bottom-[60%] right-[40%] z-10 aspect-square w-2 rounded-full bg-red-500"></div>
      )}
      <div className={`rounded-full p-[6px] ${hasNotification && 'bg-gray-200'}`}>
        <FaRegBell size="20px" className="rotate-45" />
      </div>
    </div>
  );
} 