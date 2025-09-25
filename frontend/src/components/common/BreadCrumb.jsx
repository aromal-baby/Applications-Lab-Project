import { useLocation, Link } from 'react-router-dom'

const BreadCrumb = () => {
    const location = useLocation()

    const breadcrumbMap = {
        men: 'Men',
        women: 'Women',
        accessories: 'Accessories',
        't-shirts': 'T-Shirts',
        sneakers: 'Sneakers',
        'running-shoes': 'Running Shoes',
        shirts: 'Shirts',
        pants: 'Pants',
        jackets: 'Jackets',
        suits: 'Suits',
        'casual-wear': 'Casual Wear',
        'fitness-training': 'Fitness & Training',
        dresses: 'Dresses',
        tops: 'Tops',
        skirts: 'Skirts',
        activewear: 'Activewear',
        heels: 'Heels',
        flats: 'Flats',
        boots: 'Boots',
        sandals: 'Sandals'
    }

    const paths = location.pathname.split('/').filter(Boolean)

    // Determine the main category (first path) for the back button
    const mainCategory = paths[0] || 'men'
    const backUrl = `/${mainCategory}`

    return (
        <div className="px-8 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-sm">
                {/* Dynamic Back Button */}
                <Link
                    to={backUrl}
                    className="flex items-center text-black hover:text-gray-600 transition-colors font-medium"
                >
                    <span className="mr-2">←</span>
                    <span className="uppercase tracking-wide">BACK</span>
                </Link>

                {/* Breadcrumb Trail */}
                <div className="flex items-center space-x-2 text-gray-500">
                    <Link to="/" className="hover:text-black transition-colors">
                        Home
                    </Link>
                    {paths.map((path, index) => {
                        const isLast = index === paths.length - 1
                        const displayName = breadcrumbMap[path] || path.charAt(0).toUpperCase() + path.slice(1)
                        const href = '/' + paths.slice(0, index + 1).join('/')

                        return (
                            <div key={path} className="flex items-center space-x-2">
                                <span>/</span>
                                {isLast ? (
                                    <span className="text-black">{displayName}</span>
                                ) : (
                                    <Link to={href} className="hover:text-black transition-colors">
                                        {displayName}
                                    </Link>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default BreadCrumb