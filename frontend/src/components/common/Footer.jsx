// Footer.jsx
import React, { useState, useEffect } from 'react'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Button from "./Button.jsx"
import{ footerLinks,socialLinks } from "../../../constants/index.js";

const Footer = ({ currentPage = "home" }) => {
    const [marqueeMessage, setMarqueeMessage] = useState("")

    // Alternating messages based on page/navigation
    const messages = [" SUMMER SALE - UP TO 70% OFF", " NEW IN - DISCOVER LATEST ARRIVALS"]

    useEffect(() => {
        // Determine message based on current page or random selection
        const messageIndex = currentPage === "home" ? 0 :
            currentPage === "men" ? 1 :
                Math.floor(Math.random() * 2)
        setMarqueeMessage(messages[messageIndex])
    }, [currentPage])

    // Marquee animation
    useGSAP(() => {
        if (marqueeMessage) {
            gsap.set('.marquee-text', { x: '100%' })
            gsap.to('.marquee-text', {
                x: '-50%',
                duration: 15,
                ease: 'none',
                repeat: -1
            })
        }
    }, [marqueeMessage])

    return (
        <footer className="w-full">
            {/* Marquee Section */}
            <div className="bg-gray-300 mt-50 py-6 font-black overflow-hidden relative">
                <div className="marquee-text whitespace-nowrap text-4xl font-bold text-gray-800">
                    {Array(10).fill(`${marqueeMessage} * `).join('')}
                </div>
            </div>

            {/* Brand Story Section */}
            <div className="bg-white py-1">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-90 translate-y-50">
                        {/* Left - Image/Video Placeholder */}
                        <div className="h-100 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <div className="text-6xl mb-4">🎬</div>
                                <p className="text-lg">Brand Story Video</p>
                                <p className="text-sm">Coming Soon</p>
                            </div>
                        </div>

                        {/* Right - Brand Content */}
                        <div className="space-y-10 mt-10 mb-10">
                            <h2 className="text-4xl font-bold text-gray-900">LUXE</h2>
                            <p className="text-xl text-[var(--primary-black)] italic">
                                "Where Luxury meets delightful designs - Which steals our Heart."
                            </p>
                            <p className="text-[var(--primary-white)] leading-relaxed">
                                Hear what our 12,000+ happy customers in the past decade would like to say about us.
                                Experience the perfect blend of contemporary fashion and timeless elegance that defines
                                modern luxury lifestyle.
                            </p>
                            <Button
                                containerClass="text-[var(--primary-black)] bg-[var(--primary-white)] !h-[38px] !w-[120px] text-sm"
                                borderColor="border-white"
                                title="Our Story"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Section */}
            <div className="bg-[var(--accent-gray)] text-white py-25 pt-66 -mt-5">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 border-t border-gray-700 pt-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">LUXE</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Redefining designer fashion for the modern individual.
                                Discover luxury that speaks to your style.
                            </p>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p>📍 123 Fashion Street, NY 10001</p>
                                <p>📞 +1 (555) 123-4567</p>
                                <p>✉️ hello@luxefashion.com</p>
                            </div>
                        </div>

                        {/* Footer Links */}
                        {Object.entries(footerLinks).map(([key, section]) => (
                            <div key={key} className="space-y-4">
                                <h4 className="font-semibold text-lg">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className="text-gray-300 hover:text-white transition-colors text-sm"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Store Locations */}
                    <div className="border-t border-gray-700 pt-8 mb-8">
                        <h4 className="font-semibold text-lg mb-4">Store Locations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                            <div>
                                <p className="font-medium text-white">New York Flagship</p>
                                <p>123 Fashion Avenue, NY 10001</p>
                                <p>Mon-Sat: 10AM-9PM, Sun: 11AM-7PM</p>
                            </div>
                            <div>
                                <p className="font-medium text-white">Los Angeles</p>
                                <p>456 Rodeo Drive, LA 90210</p>
                                <p>Mon-Sat: 10AM-9PM, Sun: 11AM-7PM</p>
                            </div>
                            <div>
                                <p className="font-medium text-white">Miami</p>
                                <p>789 Ocean Drive, Miami 33139</p>
                                <p>Mon-Sat: 10AM-9PM, Sun: 11AM-7PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            {/* Social Links */}
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg hover:bg-gray-700 transition-colors"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>

                            {/* Newsletter Signup */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:border-white"
                                />
                                <button className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-200 transition-colors">
                                    Subscribe
                                </button>
                            </div>

                            {/* Copyright */}
                            <div className="text-gray-400 text-sm">
                                <p>&copy; 2024 LUXE. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer