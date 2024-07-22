import Link from 'next/link';
import React from 'react';

const FloatingBadge = () => {
  return (
    <Link href="https://starter.rasmic.xyz" target='_blank' className="fixed bottom-4 right-4 bg-black border text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold z-50 hover:bg-zinc-800 transition-colors duration-300">
      Built using NextJS Starter Kit
    </Link>
  );
};

export default FloatingBadge;