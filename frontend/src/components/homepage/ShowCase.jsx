import React from 'react'
import {useNavigate} from "react-router-dom";

const ShowCase = () => {

    const navigate = useNavigate()

    return (

        <section className="py-16 mb-20">
            <div className="space-y-16">
                <div className="w-full">
                    {/* 2X2 Grid Layout */}
                    <div className="grid grid-cols-2 gap-1 h-[600px]">
                        {/* Left */}
                        <div className="col-span-1 overflow-hidden">
                            <img
                                src="/images/showCase1.jpg"
                                alt="show case"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Right */}
                        <div className="col-span-1 overflow-hidden">
                            <img
                                src="/images/showCase2.jpg"
                                alt="Fashion Showcase 2"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Section*/}
            <div className="grid grid-cols-3 gap-8 h-[550px] w-[90%] object-center mt-20 mx-auto mb-20">

                {/* Women */}
                <div onClick={() => navigate('/women')}>
                    <img
                        src="/images/category1.jpg"
                        alt="Women"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="category-name">
                        <h3 className="text-xl font-semibold text-black">Women</h3>
                    </div>
                </div>

                {/* Men */}
                <div onClick={() => navigate('/men')}>
                    <img
                        src="/images/category2.jpg"
                        alt="Men"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="category-name">
                        <h3 className="text-xl font-semibold">Men</h3>
                    </div>
                </div>

                {/* Accessories */}
                <div onClick={() => navigate('/accessories')}>
                    <img
                        src="/images/category3.jpg"
                        alt="Accessories"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="category-name">
                        <h3 className="text-xl font-semibold">Accessories</h3>
                    </div>
                </div>
            </div>

        </section>
    )
}
export default ShowCase
