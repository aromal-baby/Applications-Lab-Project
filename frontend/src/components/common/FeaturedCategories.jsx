import React from 'react'

const FeaturedCategories = ({ categories }) => {
    if (!categories || categories.length === 0) return null

    return (
        <div className="my-20 py-8">
            <div className="flex gap-6 bg-gray-100 min-h-[10rem] mx-0 items-center justify-center">
                {categories.map((category, index) => (
                    <div
                        key={index}  // Add missing key
                        className="group cursor-pointer relative transform -translate-y-6"
                    >
                        <div className="ml-8 h-48 w-52 bg-white shadow-lg overflow-hidden relative rounded-lg">
                            {/* Placeholder for image */}
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                                {category.placeholder || "👕"}
                            </div>

                            {/* Text overlay */}
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded transition-all duration-300 group-hover:bg-black">
                                <h4 className="text-white text-sm uppercase tracking-wide font-medium">
                                    {category.name}
                                </h4>
                                {category.description && (
                                    <p className="text-xs opacity-90">{category.description}</p>
                                )}
                            </div>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeaturedCategories