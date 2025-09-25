import React from 'react'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Announcement = () => {
    useGSAP(() => {
        const location = window.location.pathname;
        const isProductCategoryPage = location.includes('/men/') ||
            location.includes('/women/') ||
            location.includes('/accessories/');

        if (isProductCategoryPage) {
            // Product category pages - hide on scroll, only show when at top
            const handleScroll = () => {
                const currentScrollY = window.scrollY;

                if (currentScrollY === 0) {
                    // At the very top - show announcement
                    gsap.to('.announcement-bar', {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    // Any scroll down - hide announcement
                    gsap.to('.announcement-bar', {
                        y: -200,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }

        // Original behavior for other pages
        gsap.to('.announcement-bar', {
            y: -200,
            scrollTrigger: {
                trigger: '.announcement-bar',
                start: 'top top',
                end: '+=50',
                scrub: 0.5
            }
        })
    })

    return (
        <div className="announcement-bar fixed top-[70px] left-0 w-full bg-gray-300 text-center py-2 text-sm text-gray-700 z-10">
            Mentioning the style discovering according to the season
        </div>
    )
}

export default Announcement