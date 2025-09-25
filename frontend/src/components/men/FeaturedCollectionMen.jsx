import React from 'react'
import Button from "../common/Button.jsx";

const FeaturedCollectionMen = () => {
    return (
        <section className="relative w-full h-[500px] bg-[#A8896A] overflow-hidden mt-20">
            {/* HeroMen Image */}
            <div className="absolute inset-0 flex justify-center items-center translate-y-12 ">
                <div className="relative w-full max-w-full">
                    <img
                        src="/images/men/featured-men.jpg"
                        alt="Fashion Model"
                        className="w-full h-auto object-cover rounded-lg shadow-2xl"
                    />
                </div>
            </div>

            {/* Text Overlay */}
            <div className="flex flex-col flex-start absolute bottom-24 right-16 z-20 h-[100px]">
                {/*<div className="space-y-2">
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
                */}

                <div className="relative inline-block -translate-x-330.5 translate-y-27">
                    <Button
                        containerClass="translate-x-36.5 translate-y-2 text-yellow-500 bg-black !h-[44.41px]"
                        title="Explore Collections"
                        borderOffsetX="translate-x-37.5"
                        borderOffsetY="translate-y-3"
                        borderColor="border-black"
                    />
                </div>
            </div>
        </section>
    )
}
export default FeaturedCollectionMen
