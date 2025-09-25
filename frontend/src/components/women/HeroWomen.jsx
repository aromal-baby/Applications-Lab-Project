import React from 'react'
import Button from "../common/Button.jsx";
import { navigateToCategory } from "../../../constants/index.js";
import { useNavigate } from "react-router-dom";

const HeroWomen = () => {

    const navigate = useNavigate();

    return (
        <section className="relative w-full h-[750px] bg-[#A8896A] overflow-hidden mb-10">

            {/* HeroMen Image */}
            <div className="absolute inset-0 flex justify-center items-center translate-y-5">
                <div className="relative w-full max-w-full">
                    <img
                        src="/images/women/hero-women.jpg"
                        alt="Fashion Model"
                        className="w-full h-auto object-cover rounded-lg shadow-2xl"
                    />
                </div>
            </div>

            {/* Text Overlay */}
            <div className="flex flex-col flex-end absolute bottom-24 right-16 z-20">
                <div className="space-y-2">
                    <div className="hero-text-overlay-dark">
                        <h2 className="text-2xl font-bold ">
                            Precision Tailored for Men
                        </h2>
                    </div>
                    <div className="hero-text-overlay-dark w-[275px] translate-x-16.5">
                        <h3 className="text-2xl font-bold">
                            Who Lead, Not Follow.
                        </h3>
                    </div>
                </div>

                <div className="relative inline-block">
                    <div onClick={() => navigateToCategory(navigate, 'women')}>
                        <Button
                            containerClass="translate-x-36.5 translate-y-2 text-[var(--hero-women-text)] bg-[var(--secondary-white)] !h-[44.41px]"
                            title="Explore Collections"
                            borderOffsetX="translate-x-37.5"
                            borderOffsetY="translate-y-3"
                            borderColor="border-white"
                        />
                    </div>
                </div>
            </div>
        </section>    )
}
export default HeroWomen
