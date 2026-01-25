"use client";

import React, { useEffect, useState } from "react";

const NavMarquee: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const messages = [
    "Welcome to Micro Finance Management Information System (NexgenCosys). Technical Department Branch || Contact No:- 01-5010070, 01-5010209, 9849466781 || info@cosys.com.np, support@cosys.com.np",
    "नेक्सजेनकोसिस माइक्रो फाइनान्स व्यवस्थापन सूचना प्रणालीमा स्वागत छ । प्राविधिक विभाग शाखा || सम्पर्क नं:- ०१-५०१००७०, ०१-५०१०२०९, ९८४९४६६७८१ || info@cosys.com.np, support@cosys.com.np",
  ];

  useEffect(() => {
    if (isPaused) return;

    const scrollDuration = 30000; // 30 seconds for scrolling

    const timer = setTimeout(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
      setAnimationKey((prev) => prev + 1); // Force animation restart
    }, scrollDuration); // Only scroll duration, no wait time

    return () => clearTimeout(timer);
  }, [currentMessage, isPaused, messages.length]);

  return (
    <div
      className="w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white h-12 flex items-center overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        key={animationKey}
        className={`whitespace-nowrap inline-block animate-scroll ${
          isPaused ? "paused" : ""
        }`}
      >
        <span className="inline-block">{messages[currentMessage]}</span>
      </div>
    </div>
  );
};

export default NavMarquee;
