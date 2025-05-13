
const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">404</h1>
                <p className="text-xl text-gray-600 mb-4">Page Not Found</p>
                <p className="text-gray-500">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <button
                    onClick={() => window.history.back()} // Simple navigation back
                    className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
