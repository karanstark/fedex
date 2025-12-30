"use client";

import React from "react";
import { useNavigate } from 'react-router-dom';
import { ShaderAnimation } from "./shader-animation";

const ParticleHero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <ShaderAnimation />
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center space-y-6 pointer-events-auto">
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-tight pb-2">
                        Intelligent DCA Management
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
                        Reimagining Debt Collection with AI-Driven Insights & Automation
                    </p>
                    <div className="pt-8">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 text-center text-gray-500 text-sm z-10">
                Developed by karanstark
            </div>
        </div>
    );
};

export default ParticleHero;
