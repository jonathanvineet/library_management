import { AuthPage } from './pages/AuthPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user } = useAuth()

  return (
    <main>
      {!user ? (
        <AuthPage />
      ) : (
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome to the Library Management System</p>
            </div>
          </div>
        </ProtectedRoute>
      )}
    </main>
  )
}

export default App
