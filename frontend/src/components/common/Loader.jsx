const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

    const spinner = (
        <div className={`${sizes[size]} border-2 border-brand-900 border-t-brand-500 rounded-full animate-spin`} />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-2 border-brand-900 border-t-brand-500 rounded-full animate-spin" />
                    <span className="text-brand-600 text-sm font-body">Loading...</span>
                </div>
            </div>
        );
    }

    return spinner;
};

export default Loader;