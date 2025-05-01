import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiUser, FiLogIn, FiShoppingCart } from 'react-icons/fi';
import './App.css';

// Mock database
const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword123',
    balance: 1000000,
    created_at: '2023-01-15',
    purchases: []
  }
];

// Mock products:
const mockProducts = [
  { id: 1, name: 'TikTok Merch Pack', price: 199000, description: 'Official TikTok merchandise bundle', image: 'https://via.placeholder.com/300' },
  { id: 2, name: 'Live Stream Kit', price: 599000, description: 'Professional streaming equipment set', image: 'https://via.placeholder.com/300' },
  { id: 3, name: 'Creator Course', price: 299000, description: 'Premium content creation course', image: 'https://via.placeholder.com/300' }
];

// Main App Component:
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);

  // Check for logged in user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('tiktokShopUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogin = (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('tiktokShopUser', JSON.stringify(user));
      setCurrentSection('products');
      closeSidebar();
      return true;
    }
    return false;
  };

  const handleRegister = (userData) => {
    const newUser = {
      ...userData,
      id: `user-${mockUsers.length + 1}`,
      balance: 0,
      created_at: new Date().toISOString(),
      purchases: []
    };
    mockUsers.push(newUser);
    setCurrentUser(newUser);
    localStorage.setItem('tiktokShopUser', JSON.stringify(newUser));
    setCurrentSection('profile');
    closeSidebar();
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tiktokShopUser');
    setCurrentSection('home');
    closeSidebar();
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const purchaseItems = () => {
    if (!currentUser) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (currentUser.balance < total) {
      alert('Insufficient balance');
      return;
    }

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - total,
      purchases: [
        ...currentUser.purchases,
        {
          id: `order-${Date.now()}`,
          products: cart,
          total,
          date: new Date().toISOString(),
          status: 'completed'
        }
      ]
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('tiktokShopUser', JSON.stringify(updatedUser));
    setCart([]);
    alert('Purchase successful!');
    setCurrentSection('profile');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        currentUser={currentUser}
      />

      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 dark:hover:text-white">
                <FiMenu size={24} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <TikTokLogo />
              <span className="text-xl font-bold dark:text-white">TikTok Shop</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isMobile && (
              <NavButtons
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                currentUser={currentUser}
              />
            )}
            <CartIndicator cart={cart} setCurrentSection={setCurrentSection} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-0">
        {currentSection === 'home' && <HomePage darkMode={darkMode} products={mockProducts} />}
        {currentSection === 'login' && (
          <AuthPage
            onLogin={handleLogin}
            onRegister={handleRegister}
            isMobile={isMobile}
            closeSidebar={closeSidebar}
          />
        )}
        {currentSection === 'products' && (
          <ProductsPage
            products={mockProducts}
            currentUser={currentUser}
            addToCart={addToCart}
            setCurrentSection={setCurrentSection}
            setSelectedProduct={setSelectedProduct}
            isMobile={isMobile}
            closeSidebar={closeSidebar}
          />
        )}
        {currentSection === 'productDetail' && (
          <ProductDetailPage
            product={selectedProduct}
            currentUser={currentUser}
            addToCart={addToCart}
            setCurrentSection={setCurrentSection}
            isMobile={isMobile}
            closeSidebar={closeSidebar}
          />
        )}
        {currentSection === 'profile' && currentUser && (
          <ProfilePage
            user={currentUser}
            isMobile={isMobile}
            closeSidebar={closeSidebar}
            handleLogout={handleLogout}
          />
        )}
        {currentSection === 'cart' && (
          <CartPage
            cart={cart}
            currentUser={currentUser}
            purchaseItems={purchaseItems}
            setCurrentSection={setCurrentSection}
            isMobile={isMobile}
            closeSidebar={closeSidebar}
          />
        )}
      </main>
    </div>
  );
}

// TikTok Logo Component
const TikTokLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" className="text-tiktok">
    <path 
      fill="currentColor" 
      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    />
  </svg>
);

// Dark Mode Toggle Component
const DarkModeToggle = ({ darkMode, setDarkMode }) => (
  <button 
    onClick={() => setDarkMode(!darkMode)}
    className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-600 p-1 transition-all duration-300 flex items-center"
  >
    <div className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-300 ${
      darkMode ? 'translate-x-6' : 'translate-x-0'
    }`} />
  </button>
);

// Nav Buttons Component
const NavButtons = ({ currentSection, setCurrentSection, currentUser }) => (
  <nav className="flex gap-2">
    <button 
      onClick={() => setCurrentSection('home')}
      className={`px-4 py-2 rounded-lg ${
        currentSection === 'home' 
          ? 'bg-tiktok text-white' 
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      Home
    </button>
    {currentUser ? (
      <>
        <button 
          onClick={() => setCurrentSection('products')}
          className={`px-4 py-2 rounded-lg ${
            currentSection === 'products' 
              ? 'bg-tiktok text-white' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Products
        </button>
        <button 
          onClick={() => setCurrentSection('profile')}
          className={`px-4 py-2 rounded-lg ${
            currentSection === 'profile' 
              ? 'bg-tiktok text-white' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Profile
        </button>
      </>
    ) : (
      <button 
        onClick={() => setCurrentSection('login')}
        className={`px-4 py-2 rounded-lg ${
          currentSection === 'login' 
            ? 'bg-tiktok text-white' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        Login
      </button>
    )}
  </nav>
);

// Cart Indicator Component
const CartIndicator = ({ cart, setCurrentSection }) => (
  <button 
    onClick={() => setCurrentSection('cart')}
    className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-tiktok"
  >
    <FiShoppingCart size={20} />
    {cart.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-tiktok text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {cart.length}
      </span>
    )}
  </button>
);

// Sidebar Component
const Sidebar = ({ isOpen, closeSidebar, currentSection, setCurrentSection, currentUser }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <FiHome /> },
    ...(currentUser
      ? [
          { id: 'products', label: 'Products', icon: <FiShoppingBag /> },
          { id: 'profile', label: 'Profile', icon: <FiUser /> },
          { id: 'cart', label: 'Cart', icon: <FiShoppingCart /> }
        ]
      : [
          { id: 'login', label: 'Login/Register', icon: <FiLogIn /> }
        ]
    )
  ];

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <TikTokLogo />
          <h2 className="text-xl font-bold dark:text-white">Menu</h2>
        </div>
        <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700 dark:hover:text-white">
          <FiX size={24} />
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setCurrentSection(item.id);
                  closeSidebar();
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  currentSection === item.id 
                    ? 'bg-tiktok text-white' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Home Page Component
const HomePage = ({ darkMode, products }) => {
  const [bgIndex, setBgIndex] = useState(0);
  
  const gradients = [
    'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    'linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)',
    'linear-gradient(135deg, #8338ec 0%, #3a86ff 100%)'
  ];

  useEffect(() => {
    setBgIndex(Math.floor(Math.random() * gradients.length));
  }, [gradients.length]);

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
                  <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-lg mb-4"/>
                  <h4 className="font-bold">{product.name}</h4>
                  <p className="text-sm opacity-75">Rp {product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Auth Page Component
const AuthPage = ({ onLogin, onRegister, isMobile, closeSidebar }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const success = await onLogin(formData.email, formData.password);
        if (!success) setError('Invalid email or password');
      } else {
        const success = await onRegister(formData);
        if (!success) setError('Registration failed');
      }
    } catch (err) {

      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };


  useEffect(() => {
    if (isMobile) closeSidebar();
  }, [isMobile, closeSidebar]);
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {isLogin ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit" className="w-full bg-tiktok text-white py-2 rounded-lg hover:bg-opacity-90">
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit" className="w-full bg-tiktok text-white py-2 rounded-lg hover:bg-opacity-90">
              Register
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

// Products Page Component
const ProductsPage = ({ products, currentUser, addToCart, setCurrentSection, setSelectedProduct, isMobile, closeSidebar }) => {
  const viewProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentSection('productDetail');
    if (isMobile) closeSidebar();
  };

  return (
    <section className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4"/>
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              <p className="text-tiktok font-bold">Rp {product.price.toLocaleString()}</p>
              <div className="flex gap-2 mt-4">
                <button 
                  className="flex-1 bg-tiktok text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                  onClick={() => viewProductDetail(product)}
                >
                  Details
                </button>
                <button 
                  className="flex-1 border border-tiktok text-tiktok px-4 py-2 rounded-lg hover:bg-tiktok/10"
                  onClick={() => {
                    if (!currentUser) {
                      setCurrentSection('login');
                    } else {
                      addToCart(product);
                    }
                  }}
                >
                  {currentUser ? 'Add to Cart' : 'Login to Buy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Product Detail Page Component
const ProductDetailPage = ({ product, currentUser, addToCart, setCurrentSection, isMobile, closeSidebar }) => {
  const goBack = () => {
    setCurrentSection('products');
    if (isMobile) closeSidebar();
  };

  return (
    <section className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button 
          onClick={goBack}
          className="mb-6 flex items-center text-tiktok hover:underline"
        >
          ← Back to Products
        </button>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-8 md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              <p className="text-2xl text-tiktok font-bold mb-6">Rp {product.price.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{product.description}</p>
              
              <div className="space-y-4">
                <button 
                  className="w-full bg-tiktok text-white py-3 rounded-lg hover:bg-opacity-90 font-bold"
                  onClick={() => {
                    if (!currentUser) {
                      setCurrentSection('login');
                    } else {
                      addToCart(product);
                      setCurrentSection('cart');
                    }
                  }}
                >
                  {currentUser ? 'Add to Cart' : 'Login to Purchase'}
                </button>
                {currentUser && (
                  <button className="w-full border border-tiktok text-tiktok py-3 rounded-lg hover:bg-tiktok/10 font-bold">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



// Profile Page Component
const ProfilePage = ({ user, isMobile, closeSidebar, handleLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    if (isMobile) closeSidebar();
  }, [isMobile, closeSidebar]);

  // Handle case when user data is not available
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <FiUser className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Sesi Tidak Valid
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Data pengguna tidak tersedia. Silakan login kembali.
          </p>
          <button
            onClick={() => {
              handleLogout?.();
              window.location.hash = "#login";
            }}
            className="bg-tiktok text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-opacity"
          >
            <FiLogIn className="inline mr-2" />
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  // Rest of the component...



  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handlePurchaseClick = (purchase) => {
    setSelectedPurchase(purchase);
  };

  const closePurchaseDetail = () => {
    setSelectedPurchase(null);
  };

  return (
    <section className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">Profil Pengguna</h2>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-tiktok flex items-center justify-center text-white text-2xl shadow-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">{user.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 break-all">{user.email}</p>
              <div className="mt-2 bg-tiktok/10 text-tiktok px-4 py-2 rounded-full inline-block">
                Saldo: Rp {user.balance.toLocaleString('id-ID')}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Bergabung pada: {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          {/* Purchase History */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold mb-4 text-tiktok flex items-center gap-2">
                <FiShoppingBag />
                Riwayat Transaksi
              </h4>
              
              {user.purchases.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Belum ada transaksi
                  </p>
                  <button
                    onClick={() => window.location.hash = "#products"}
                    className="bg-tiktok text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                  >
                    Lihat Produk
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.purchases.map(purchase => (
                    <div 
                      key={purchase.id}
                      className="bg-white dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePurchaseClick(purchase)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">Order #{purchase.id.slice(-6)}</p>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {purchase.products?.length || 0} item
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatDate(purchase.date)}
                          </p>
                          <p className="text-tiktok font-medium">
                            Rp {purchase.total.toLocaleString('id-ID')}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            purchase.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 py-3 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FiLogOut />
                Keluar Akun
              </button>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Konfirmasi Logout</h3>
              <p className="mb-6">Anda yakin ingin keluar dari akun ini?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Detail Modal */}
        {selectedPurchase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Detail Transaksi</h3>
                <button
                  onClick={closePurchaseDetail}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium">ID Transaksi:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedPurchase.id}</p>
                </div>
                
                <div>
                  <p className="font-medium">Total:</p>
                  <p className="text-tiktok">Rp {selectedPurchase.total.toLocaleString('id-ID')}</p>
                </div>
                
                <div>
                  <p className="font-medium">Tanggal:</p>
                  <p className="text-gray-600 dark:text-gray-300">{formatDate(selectedPurchase.date)}</p>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Produk:</p>
                  <div className="space-y-2">
                    {selectedPurchase.products?.map((product, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


// Cart Page Component
const CartPage = ({ cart, currentUser, purchaseItems, setCurrentSection, isMobile, closeSidebar }) => {
  const goBack = () => {
    setCurrentSection('products');
    if (isMobile) closeSidebar();
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button 
          onClick={goBack}
          className="mb-6 flex items-center text-tiktok hover:underline"
        >
          ← Continue Shopping
        </button>
        
        <h2 className="text-3xl font-bold mb-8">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl text-center">
            <p className="text-lg">Your cart is empty</p>
            <button
              onClick={goBack}
              className="mt-4 bg-tiktok text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                  </div>
                  <p className="text-tiktok font-medium">
                    Rp {item.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">Total:</span>
                <span className="text-tiktok font-bold text-xl">
                  Rp {total.toLocaleString()}
                </span>
              </div>

              {!currentUser ? (
                <button
                  onClick={() => setCurrentSection('login')}
                  className="w-full bg-tiktok text-white py-3 rounded-lg hover:bg-opacity-90 font-bold"
                >
                  Login to Checkout
                </button>
              ) : (
                <button
                  onClick={purchaseItems}
                  className="w-full bg-tiktok text-white py-3 rounded-lg hover:bg-opacity-90 font-bold"
                  disabled={currentUser.balance < total}
                >
                  {currentUser.balance < total ? 'Insufficient Balance' : 'Complete Purchase'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default App;