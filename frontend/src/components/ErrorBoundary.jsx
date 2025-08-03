import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to a logging service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-8 font-sans">
          <div className="bg-white rounded-3xl p-12 max-w-2xl w-full shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">⚠️</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Something went wrong</h1>
              <p className="text-xl text-gray-600">We're sorry, but something unexpected happened.</p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-3">What happened?</h3>
                <p className="text-gray-700 leading-relaxed">
                  The application encountered an unexpected error and couldn't continue.
                  This might be a temporary issue.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleReload}
                  className="bg-blue-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1"
                >
                  🔄 Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="bg-gray-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-700 hover:-translate-y-1"
                >
                  🏠 Go to Home
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                  <h4 className="text-lg font-bold text-red-800 mb-3">Debug Information (Development Only)</h4>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-red-700 font-semibold mb-2">Error Details</summary>
                    <pre className="bg-red-100 p-4 rounded-xl overflow-auto text-red-800 whitespace-pre-wrap">{this.state.error.toString()}</pre>
                    <pre className="bg-red-100 p-4 rounded-xl overflow-auto text-red-800 whitespace-pre-wrap mt-2">{this.state.errorInfo.componentStack}</pre>
                  </details>
                </div>
              )}
            </div>

            <div className="text-center mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-2">If this problem persists, please contact the system administrator.</p>
              <p className="text-gray-700"><strong>Email:</strong> mis@university.edu</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
