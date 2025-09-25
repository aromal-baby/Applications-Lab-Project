import React from 'react'
import Button from "../common/Button.jsx";
import { useNavigate } from "react-router-dom";

const Hero = () => {

    const navigate = useNavigate();

    return (
        <section className="relative w-full h-[750px] overflow-hidden">

            {/* HeroMen Image */}
            <div className="absolute inset-0 flex justify-center items-center translate-y-5">
                <div className="relative w-full max-w-full">
                    <img
                        src="/images/hero-main.jpg"
                        alt="Fashion Model"
                        className="w-full h-auto object-cover shadow-2xl"
                    />
                </div>
            </div>

            {/* Text Overlay */}
            <div className="flex flex-col flex-end absolute bottom-24 right-16 z-20">
                <div className="space-y-2">
                    <div className="hero-text-overlay-light">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Redefining Designer Fashion,
                        </h2>
                    </div>
                    <div className="hero-text-overlay-light justify-end w-[215px] translate-x-31">
                        <h3 className="text-2xl font-bold text-gray-900">
                            All Day, Everyday.
                        </h3>
                    </div>
                </div>

                <div className="relative inline-block">
                    <div onClick={() => navigate('/category-explore')}>
                        <Button
                            containerClass="translate-x-36.5 translate-y-2 text-white bg-black !h-[44.41px]"
                            title="Explore Collections"
                            borderOffsetX="translate-x-37.5"
                            borderOffsetY="translate-y-3"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
