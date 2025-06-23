const Header = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4 h-auto">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 p-2 bg-clip-text text-transparent">
                        Pathfinding Visualizer
                    </h1>
                </div>

                <p className="text-lg text-inherit max-w-2xl mx-auto">
                    Explore and understand how different pathfinding algorithms work through interactive visualization.
                </p>
                <h2 className="text-2xl text-purple-400">Choose your algorithm and watch the magic happen!</h2>
            </div>
        </div>
        
    )
}

export default Header;