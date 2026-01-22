"use client";
import React from "react";

export default function Dashboard() {
  const stats = [
    { label: "Today's Money", value: "$53,000", change: "+55%", icon: "💰" },
    { label: "Daily Users", value: "2,300", change: "+3%", icon: "👥" },
    { label: "New Clients", value: "-3,052", change: "-2%", icon: "📄" },
    // { label: "Total Sales", value: "$173,000", change: "+8%", icon: "🛒" },
  ];

  return (
    <div className="flex   min-h-screen overflow-auto">
      {/* Dashboard Content with margins */}
      <div className="flex flex-col mr-2 ml-2 flex-1">
        {/* Header */}
        <div className="w-full flex justify-between items-center mt-2">
          <div>
            {/* <p className="text-gray-400 text-sm">Pages / Dashboard</p> */}
            <h1 className=" text-2xl font-bold px-2">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Type here..."
              className=" border border-slate-700 rounded-lg   focus:outline-none focus:border-blue-500"
            />
            <button className="text-white text-xl">🔔</button>
            <button className="text-white text-xl">⚙️</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className=" grid grid-cols-3 gap-6 mt-2">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card backdrop-blur-sm border border-slate-700 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className=" text-xs mb-1">{stat.label}</p>
                  <p className=" text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-xs mt-1 ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-3 gap-6 mt-2">
          {/* Welcome Card */}
          <div className=" card backdrop-blur-sm border  rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-gray-400 text-sm mb-2">Welcome back,</p>
              <h2 className=" text-3xl font-bold mb-2">Mark Johnson</h2>
              <p className="text-gray-400 text-sm mb-4">
                Glad to see you again!
              </p>
              <p className="text-gray-400 text-sm">Ask me anything.</p>
              <button className="mt-4 text-blue-400 text-sm hover:text-blue-300">
                Tap to record →
              </button>
            </div>
          </div>

          {/* Satisfaction Rate */}
          <div className="card backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h3 className=" text-lg font-semibold mb-2">Satisfaction Rate</h3>
            <p className="text-gray-400 text-sm mb-6">From all projects</p>
            <div className="relative w-40 h-40 mx-auto">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="439.6"
                  strokeDashoffset="44"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className=" text-4xl font-bold">95%</span>
                <span className="text-gray-400 text-xs">Based on likes</span>
              </div>
            </div>
          </div>

          {/* Referral Tracking */}
          <div className="card backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h3 className=" text-lg font-semibold mb-6">Referral Tracking</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Invited</p>
                <p className=" text-2xl font-bold">145 people</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Bonus</p>
                <p className=" text-2xl font-bold">1,465</p>
              </div>
            </div>
            <div className="relative w-32 h-32 mx-auto mt-4">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="351.8"
                  strokeDashoffset="35"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className=" text-3xl font-bold">9.3</span>
                <span className="text-gray-400 text-xs">Total Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6 mt-2">
          {/* Sales Overview */}
          <div className="card backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-2">
              Sales overview
            </h3>
            <p className="text-gray-400 text-sm mb-6">(+5) more in 2021</p>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 600 200">
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 180 Q 50 120 100 140 T 200 100 T 300 60 T 400 100 T 500 80 T 600 50"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 0 180 Q 50 120 100 140 T 200 100 T 300 60 T 400 100 T 500 80 T 600 50 L 600 200 L 0 200 Z"
                  fill="url(#areaGradient)"
                />
              </svg>
            </div>
          </div>

          {/* Active Users */}
          <div className="card backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-2">
              Active Users
            </h3>
            <p className="text-gray-400 text-sm mb-6">(+23) than last week</p>
            <div className="flex justify-between items-end h-48">
              {[120, 180, 140, 200, 160, 220, 240, 200, 180, 160, 140, 120].map(
                (height, index) => (
                  <div
                    key={index}
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                    style={{ height: `${height}px` }}
                  ></div>
                ),
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-gray-400 text-xs mb-1">👥 Users</p>
                <p className="text-white font-bold">32,984</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">👆 Clicks</p>
                <p className="text-white font-bold">2.42m</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">💰 Sales</p>
                <p className="text-white font-bold">2,400$</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">📦 Items</p>
                <p className="text-white font-bold">320</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
