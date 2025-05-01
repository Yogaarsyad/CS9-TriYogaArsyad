import { useState, useEffect } from 'react'
import './App.css'


// Sample product data
const products = [
  { id: 1, name: 'TikTok Merch Pack', price: 199000, description: 'Official TikTok merchandise bundle' },
  { id: 2, name: 'Live Stream Kit', price: 599000, description: 'Professional streaming equipment set' },
  { id: 3, name: 'Creator Course', price: 299000, description: 'Premium content creation course' },
]

const HomePage = ({ darkMode }) => {
  const [bgIndex, setBgIndex] = useState(0)
  
  const gradients = [
    'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    'linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)',
    'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
    'linear-gradient(135deg, #00b4d8 0%, #90e0ef 100%)',
    'linear-gradient(135deg, #8338ec 0%, #3a86ff 100%)'
  ]

  useEffect(() => {
    setBgIndex(Math.floor(Math.random() * gradients.length))
  }, [gradients.length])

  return (
    <section className="relative min-h-screen animate-fadeIn">
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out" 
        style={{ 
          background: gradients[bgIndex],
          opacity: darkMode ? 0.9 : 1
        }}
      />
      
      <div className="relative z-10 text-white">
        <div className="max-w-6xl mx-auto py-24 px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-slideIn">
            Welcome to TikTok Shop
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-lg hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Trending Now</h3>
              <p>Discover the latest viral products</p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-lg hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Flash Sale</h3>
              <p>Limited time offers</p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-lg hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">New Arrivals</h3>
              <p>Fresh from the factory</p>
            </div>
          </div>

          <div className="bg-black/20 p-8 rounded-2xl backdrop-blur-lg">
            <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0,4).map(product => (
                <div key={product.id} className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
                  <div className="h-40 bg-white/20 rounded-lg mb-4 animate-pulse"/>
                  <h4 className="font-bold">{product.name}</h4>
                  <p className="text-sm opacity-75">Rp {product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




// Navigation button component:
const NavButton = ({ children, section, currentSection, onClick }) => (
  <button 
    onClick={() => onClick(section)}
    className={`px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 active:scale-95 ${
      currentSection === section ? 'font-bold text-tiktok' : 'text-gray-600 dark:text-gray-300'
    }`}
  >
    {children}
  </button>
)




// Login/Register page component:
const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <section className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="max-w-md mx-auto my-12 p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg ${isLogin ? 'bg-tiktok text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg ${!isLogin ? 'bg-tiktok text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />
            <button className="w-full bg-tiktok text-white py-2 rounded-lg hover:bg-opacity-90">
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />
            <button className="w-full bg-tiktok text-white py-2 rounded-lg hover:bg-opacity-90">
              Register
            </button>
          </form>
        )}
      </div>
    </section>
  )
}




// Products page component:
const ProductsPage = ({ setCurrentSection }) => {
  return (
    <section className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="max-w-6xl mx-auto py-12">
        <h2 className="text-4xl font-bold mb-8 text-center">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              <p className="text-tiktok font-bold">Rp {product.price.toLocaleString()}</p>
              <button 
                className="mt-4 bg-tiktok text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                onClick={() => setCurrentSection('productDetail')}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




// Profile page component:
const ProfilePage = () => {
  return (
    <section className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-4xl font-bold mb-8 text-center">User Profile</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-tiktok flex items-center justify-center text-white text-2xl">
              JD
            </div>
            <div>
              <h3 className="text-2xl font-bold">John Doe</h3>
              <p className="text-gray-600 dark:text-gray-300">john.doe@example.com</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold mb-4 text-tiktok">Purchase History</h4>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-bold">Order #12345</p>
                  <p className="text-gray-600 dark:text-gray-300">Product: TikTok Merch Pack</p>
                  <p className="text-gray-600 dark:text-gray-300">Total: Rp 199,000</p>
                </div>
              </div>
            </div>
            <button className="w-full bg-tiktok text-white py-2 rounded-lg hover:bg-opacity-90">
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}








// Main App component:
function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="logo-tiktok.svg" 
              alt="TikTok Logo" 
              className="h-8" 
            />
            <span className="text-xl font-bold dark:text-white">TikTok Shop</span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-2">
              <NavButton 
                section="home"
                currentSection={currentSection}
                onClick={setCurrentSection}
              >
                Home
              </NavButton>
              <NavButton 
                section="login"
                currentSection={currentSection}
                onClick={setCurrentSection}
              >
                Login/Register
              </NavButton>
              <NavButton 
                section="products"
                currentSection={currentSection}
                onClick={setCurrentSection}
              >
                Products
              </NavButton>
              <NavButton 
                section="profile"
                currentSection={currentSection}
                onClick={setCurrentSection}
              >
                Profile
              </NavButton>
            </nav>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-600 p-1 transition-all duration-300"
            >
              <div className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-300 ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {currentSection === 'home' && <HomePage darkMode={darkMode} />}
        {currentSection === 'login' && <LoginRegisterPage />}
        {currentSection === 'products' && <ProductsPage setCurrentSection={setCurrentSection} />}
        {currentSection === 'profile' && <ProfilePage />}
      </main>
    </div>
  )
}

export default App