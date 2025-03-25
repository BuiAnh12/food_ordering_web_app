const UnauthorizedPage = () => {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-lg text-center">
          <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-4 text-gray-600">
            You do not have permission to access this page.
          </p>
          <a
            href="/home"
            className="mt-6 inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  };
  
  export default UnauthorizedPage;
  