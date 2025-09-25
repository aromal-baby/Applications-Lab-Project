import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const FilterTabs = ({ tabs = [] }) => {
    const [activeTab, setActiveTab] = useState(tabs[0] || '')
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [sortBy, setSortBy] = useState('Relevance')
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            console.log('Scroll position:', scrollTop) // Add this to see if it's firing
            setIsSticky(scrollTop > 600) // Adjust this value based on when you want it to stick
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const sortOptions = [
        'Relevance',
        'Price: Low to High',
        'Price: High to Low',
        'Newest',
        'Best Selling'
    ]

    return (
        <div className={`bg-white border-b border-gray-200 ${isSticky ? 'sticky top-0 z-50 shadow-sm' : ''}`}>
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Filter Tabs */}
                    <div className="flex overflow-x-auto scrollbar-hide space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-2 text-sm font-medium transition-colors border-b-2 ${
                                    activeTab === tab
                                        ? 'text-black border-black'
                                        : 'text-gray-500 hover:text-black border-transparent'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Filter & Sort Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center space-x-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors text-sm font-medium"
                        >
                            <span>FILTER & SORT</span>
                            <div className="flex flex-col">
                                <div className="w-3 h-0.5 bg-current mb-0.5"></div>
                                <div className="w-3 h-0.5 bg-current mb-0.5"></div>
                                <div className="w-3 h-0.5 bg-current"></div>
                            </div>
                        </button>

                        {/* Sort Dropdown */}
                        {showSortMenu && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg z-10">
                                <div className="p-2">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Sort by
                                    </p>
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSortBy(option)
                                                setShowSortMenu(false)
                                            }}
                                            className={`w-full text-left px-2 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                                sortBy === option ? 'font-medium' : ''
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hide scrollbar for tabs */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export default FilterTabs