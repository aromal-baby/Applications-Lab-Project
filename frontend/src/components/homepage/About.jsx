import React from 'react'
import Button from "../common/Button.jsx"

const About = () => {
    return (
        <section className="w-full py-16 bg-[var(--secondary-white)] mb-10">
            <div className="max-w-7xl py-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Image */}
                    <div className="aspect-[1/1] overflow-hidden left-0 bottom-3">
                        <img
                            src="/images/about-main.jpg"
                            alt="Fashion Model in Checkered Blazer"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Content */}
                    <div className="space-y-6 translate-x-35">
                        <h4 className="text-4xl lg:text-3xl font-bold text-gray-900">
                            Crafted for the Modern Individual
                        </h4>
                        <p className="text-gray-600 text-lg max-w-lg">
                            Each piece in our collection represents the perfect blend of contemporary design and
                            timeless elegance.
                        </p>
                        <Button
                            containerClass="text-white bg-black !h-[48px] !w-[150px]"
                            borderColor="border-black"
                            title="Our Story"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About