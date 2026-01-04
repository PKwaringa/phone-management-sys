
import React, { useState, useEffect } from 'react';
import { Phone, Users, Package, MessageSquare, Plus, Loader2, CheckCircle, AlertCircle, X, TrendingDown, TrendingUp, ShoppingCart, Lock, Mail, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

// SHA-256 hash function for password encryption
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const PhoneShopManager = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('sale');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [n8nConfig, setN8nConfig] = useState({
    webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL,
    shopName: 'Tech Mobile Store',
    location: 'Murang\'a, Kenya',
    inquiryNumber: '+254712345678',
    whatsappGroup: 'https://chat.whatsapp.com/your-group-link',
    orderFormUrl: 'https://forms.google.com/your-form-link'
  });

  useEffect(() => {
    loadConfig();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = await window.storage.get('phone-shop-auth');
      if (authData) {
        const auth = JSON.parse(authData.value);
        if (auth.isAuthenticated && auth.user) {
          setIsAuthenticated(true);
          setCurrentUser(auth.user);
          setCurrentView('app');
        }
      }
    } catch (error) {
      console.log('No auth session found');
    }
  };

  const loadConfig = async () => {
    try {
      const configData = await window.storage.get('n8n-config');
      if (configData) setN8nConfig(JSON.parse(configData.value));
    } catch (error) {
      console.log('No config found, using defaults');
    }
  };

  const saveConfig = async (config) => {
    setN8nConfig(config);
    await window.storage.set('n8n-config', JSON.stringify(config));
  };

  const logout = async () => {
    await window.storage.delete('phone-shop-auth');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // ===== LANDING PAGE COMPONENT =====
  const LandingPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <Phone className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{n8nConfig.shopName}</h1>
                <p className="text-blue-200 text-sm">{n8nConfig.location}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentView('login')}
                className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <LogIn size={18} />
                Staff Login
              </button>
            </div>
          </nav>

          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Premium Smartphones<br />at Unbeatable Prices
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your trusted destination for the latest phones, genuine products, and exceptional customer service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open(n8nConfig.orderFormUrl, '_blank')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
              >
                <ShoppingCart size={24} />
                Order Online Now
              </button>
              <a
                href={`tel:${n8nConfig.inquiryNumber}`}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
              >
                <Phone size={24} />
                Call Us: {n8nConfig.inquiryNumber}
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white border border-white border-opacity-20">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Genuine Products</h3>
              <p className="text-blue-100">All phones are authentic with manufacturer warranty</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white border border-white border-opacity-20">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-blue-100">Quick delivery across Kenya within 24-48 hours</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white border border-white border-opacity-20">
              <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-blue-100">Dedicated customer service and after-sales support</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Join Our WhatsApp Community</h3>
            <p className="text-gray-600 mb-6">Get instant updates on new arrivals, exclusive deals, and special offers</p>
            <a
              href={n8nConfig.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
            >
              <MessageSquare size={24} />
              Join WhatsApp Group
            </a>
          </div>
        </div>
      </div>
    );
  };

  // ===== AUTH PAGE COMPONENT (Login & Signup) =====
  const AuthPage = ({ mode }) => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '', color: '' });

    const validatePassword = (password) => {
      let score = 0;
      let message = '';
      let color = '';

      if (password.length < 8) {
        return { score: 0, message: 'Password must be at least 8 characters', color: 'text-red-600' };
      }
      
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^a-zA-Z0-9]/.test(password)) score++;

      if (score <= 2) {
        message = 'Weak password';
        color = 'text-red-600';
      } else if (score <= 3) {
        message = 'Moderate password';
        color = 'text-yellow-600';
      } else {
        message = 'Strong password';
        color = 'text-green-600';
      }

      return { score, message, color };
    };

    const handlePasswordChange = (value) => {
      setFormData({...formData, password: value});
      if (value) {
        setPasswordStrength(validatePassword(value));
      } else {
        setPasswordStrength({ score: 0, message: '', color: '' });
      }
    };

    const handleSubmit = async () => {
      setStatus({ type: '', message: '' });

      if (mode === 'signup') {
        if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
          setStatus({ type: 'error', message: 'Please fill in all fields' });
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setStatus({ type: 'error', message: 'Passwords do not match' });
          return;
        }

        const strength = validatePassword(formData.password);
        if (strength.score < 2) {
          setStatus({ type: 'error', message: 'Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers' });
          return;
        }
      } else {
        if (!formData.email || !formData.password) {
          setStatus({ type: 'error', message: 'Please enter email and password' });
          return;
        }
      }

      if (!n8nConfig.webhookUrl) {
        setStatus({ type: 'error', message: 'System configuration error. Please contact administrator.' });
        return;
      }

      setIsSubmitting(true);

      try {
        const hashedPassword = await hashPassword(formData.password);

        const authData = {
          action: mode === 'signup' ? 'signup_request' : 'login_request',
          timestamp: new Date().toISOString(),
          user: {
            email: formData.email.toLowerCase().trim(),
            passwordHash: hashedPassword,
            ...(mode === 'signup' && {
              fullName: formData.fullName,
              phoneNumber: formData.phoneNumber
            })
          }
        };

        const response = await fetch(n8nConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authData)
        });

        if (response.ok) {
          const result = await response.json();
          
          if (mode === 'signup') {
            setStatus({ 
              type: 'success', 
              message: '✅ Account request submitted! You will receive an email once your account is approved by the administrator.' 
            });
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
              fullName: '',
              phoneNumber: ''
            });
          } else {
            if (result.success && result.user) {
              await window.storage.set('phone-shop-auth', JSON.stringify({
                isAuthenticated: true,
                user: result.user,
                timestamp: new Date().toISOString()
              }));
              
              setCurrentUser(result.user);
              setIsAuthenticated(true);
              setCurrentView('app');
            } else {
              setStatus({ 
                type: 'error', 
                message: result.message || 'Invalid credentials or account not approved yet' 
              });
            }
          }
        } else {
          setStatus({ type: 'error', message: 'Authentication failed. Please try again.' });
        }
      } catch (error) {
        setStatus({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={() => setCurrentView('landing')}
            className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {mode === 'signup' ? <UserPlus className="text-white" size={32} /> : <Lock className="text-white" size={32} />}
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                {mode === 'signup' ? 'Create Staff Account' : 'Staff Login'}
              </h2>
              <p className="text-gray-600 mt-2">
                {mode === 'signup' ? 'Request access to the management system' : 'Access the management system'}
              </p>
            </div>

            <div className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+254712345678"
                      disabled={isSubmitting}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {mode === 'signup' && passwordStrength.message && (
                  <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                    {passwordStrength.message}
                  </p>
                )}
                {mode === 'signup' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with uppercase, lowercase, numbers, and symbols
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  mode === 'signup' ? 'Request Account' : 'Login'
                )}
              </button>
            </div>

            {status.message && (
              <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
                status.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={18} />
                ) : (
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                )}
                <p>{status.message}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              {mode === 'signup' ? (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Need an account?{' '}
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Request access
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

   // ===== SaleForm PAGE COMPONENT  =====
 const SaleForm = () => {
    const [formData, setFormData] = useState({
      customerName: '',
      phoneNumber: '',
      phoneBought: '',
      amount: '',
      paymentMethod: 'cash',
      salesPerson: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (!formData.customerName || !formData.phoneNumber || !formData.phoneBought || !formData.amount || !formData.salesPerson){
        setStatus({ type: 'error', message: 'Please fill in all required fields' });
        return;
      }

      if (!n8nConfig.webhookUrl) {
        setStatus({ type: 'error', message: 'Please configure n8n webhook URL in Settings' });
        return;
      }

      setIsSubmitting(true);
      setStatus({ type: '', message: '' });

      try {
        const saleData = {
          action: 'new_sale',
          timestamp: new Date().toISOString(),
          sale: {
            ...formData,
            amount: parseFloat(formData.amount)
          },
          shop: {
            name: n8nConfig.shopName,
            location: n8nConfig.location,
            inquiryNumber: n8nConfig.inquiryNumber,
            whatsappGroup: n8nConfig.whatsappGroup
          }
        };

        const response = await fetch(n8nConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saleData)
        });

        if (response.ok) {
          const result = await response.json();
          setStatus({ 
            type: 'success', 
            message: `✅ Sale recorded! ${result.receiptNumber ? `Receipt #${result.receiptNumber}` : ''}\n${result.message || 'Customer will receive WhatsApp message shortly.\nInventory automatically updated!'}`
          });
          setFormData({
            customerName: '',
            phoneNumber: '',
            phoneBought: '',
            amount: '',
            paymentMethod: 'cash',
            salesPerson: ''
          });
        } else {
          setStatus({ type: 'error', message: 'Failed to record sale. Please check your n8n webhook.' });
        }
      } catch (error) {
        setStatus({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">New Sale</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+254712345678"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Model Bought *</label>
            <input
              type="text"
              value={formData.phoneBought}
              onChange={(e) => setFormData({...formData, phoneBought: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="iPhone 13 Pro"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES) *</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="cash">Cash</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank Transfer</option>
              <option value="installment">Installment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sales Person *</label>
            <input
              type="text"
              value={formData.salesPerson}
              onChange={(e) => setFormData({...formData, salesPerson: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Kamau"
              disabled={isSubmitting}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              'Record Sale & Send Thank You Message'
            )}
          </button>
        </div>

        {status.message && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            status.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            )}
            <p className={`text-sm whitespace-pre-wrap ${
              status.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {status.message}
            </p>
          </div>
        )}

      </div>
    );
  };

  // ===== InventoryManager PAGE COMPONENT  =====
  const InventoryManager = () => {
    const [actionType, setActionType] = useState('add_stock');
    const [formData, setFormData] = useState({
      productId: '',
      model: '',
      brand: '',
      quantity: '',
      price: '',
      minimumStock: '5'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInventoryAction = async () => {
      if (actionType === 'new_product') {
        if (!formData.model || !formData.brand || !formData.quantity || !formData.price) {
          setStatus({ type: 'error', message: 'Please fill in all fields for new product' });
          return;
        }
      } else {
        if (!formData.productId || !formData.quantity) {
          setStatus({ type: 'error', message: 'Please select product and enter quantity' });
          return;
        }
      }

      if (!n8nConfig.webhookUrl) {
        setStatus({ type: 'error', message: 'Please configure n8n webhook URL in Settings' });
        return;
      }

      setIsSubmitting(true);
      setStatus({ type: '', message: '' });

      try {
        const inventoryData = {
          action: 'inventory_added',
          actionType: actionType,
          timestamp: new Date().toISOString(),
          data: {
            productId: formData.productId || undefined,
            brand: formData.brand || undefined,
            model: formData.model || undefined,
            quantity: parseInt(formData.quantity),
            price: formData.price ? parseFloat(formData.price) : undefined,
            minimumStock: formData.minimumStock ? parseInt(formData.minimumStock) : 5
          },
          shop: {
            name: n8nConfig.shopName,
            location: n8nConfig.location
          }
        };

        const response = await fetch(n8nConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inventoryData)
        });

        if (response.ok) {
          const result = await response.json();
          let message = '';
          
          if (actionType === 'add_stock') {
            message = `✅ Stock added successfully!\n${result.message || `${formData.quantity} units added to inventory.`}`;
          } else if (actionType === 'sale') {
            message = `✅ Sale recorded!\n${result.message || `Stock reduced by ${formData.quantity} units.`}`;
          } else {
            message = `✅ New product added!\n${result.message || `${formData.brand} ${formData.model} added to inventory.`}`;
          }

          if (result.lowStockAlert) {
            message += `\n⚠️ LOW STOCK ALERT: Current stock is below minimum!`;
          }

          setStatus({ type: 'success', message });
          setFormData({
            productId: '',
            model: '',
            brand: '',
            quantity: '',
            price: '',
            minimumStock: '5'
          });
        } else {
          setStatus({ type: 'error', message: 'Failed to update inventory. Please check your n8n webhook.' });
        }
      } catch (error) {
        setStatus({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActionType('add_stock')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                actionType === 'add_stock'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <TrendingUp size={18} />
              <span className="font-medium text-sm">Add Stock</span>
            </button>
            <button
              onClick={() => setActionType('sale')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                actionType === 'sale'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <TrendingDown size={18} />
              <span className="font-medium text-sm">Record Sale</span>
            </button>
            <button
              onClick={() => setActionType('new_product')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                actionType === 'new_product'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Plus size={18} />
              <span className="font-medium text-sm">New Product</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {actionType === 'new_product' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Samsung"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Galaxy S23"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="45000"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Alert Level *</label>
                <input
                  type="number"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({...formData, minimumStock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">You'll receive an alert when stock falls below this level</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID *</label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PROD-001"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Enter the Product ID from your inventory sheet</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {actionType === 'add_stock' ? 'Quantity to Add *' : 'Quantity Sold *'}
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          <button
            onClick={handleInventoryAction}
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-white ${
              actionType === 'add_stock' ? 'bg-green-600 hover:bg-green-700' :
              actionType === 'sale' ? 'bg-red-600 hover:bg-red-700' :
              'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {actionType === 'add_stock' && <><TrendingUp size={16} /> Add Stock</>}
                {actionType === 'sale' && <><TrendingDown size={16} /> Record Sale</>}
                {actionType === 'new_product' && <><Plus size={16} /> Add New Product</>}
              </>
            )}
          </button>
        </div>

        {status.message && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            status.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            )}
            <p className={`text-sm whitespace-pre-wrap ${
              status.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {status.message}
            </p>
          </div>
        )}

        
      </div>
    );
  };

  // ===== OfferBroadcast PAGE COMPONENT  =====
  const OfferBroadcast = () => {
    const [offerData, setOfferData] = useState({
      phoneModel: '',
      price: '',
      features: '',
      dealType: 'new-arrival',
      images: []
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      const imagePromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              data: reader.result,
              type: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(images => {
        setOfferData({...offerData, images: [...offerData.images, ...images]});
      });
    };

    const removeImage = (index) => {
      const newImages = offerData.images.filter((_, i) => i !== index);
      setOfferData({...offerData, images: newImages});
    };

    const handleSendOffer = async () => {
      if (!offerData.phoneModel || !offerData.price) {
        setStatus({ type: 'error', message: 'Please enter phone model and price' });
        return;
      }

      if (!n8nConfig.webhookUrl) {
        setStatus({ type: 'error', message: 'Please configure n8n webhook URL in Settings' });
        return;
      }

      setIsSubmitting(true);
      setStatus({ type: '', message: '' });

      try {
        const broadcastData = {
          action: 'broadcast_offer',
          timestamp: new Date().toISOString(),
          offer: {
            ...offerData,
            price: parseFloat(offerData.price)
          },
          shop: {
            name: n8nConfig.shopName,
            location: n8nConfig.location,
            inquiryNumber: n8nConfig.inquiryNumber
          }
        };

        const response = await fetch(n8nConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(broadcastData)
        });

        if (response.ok) {
          const result = await response.json();
          setStatus({ 
            type: 'success', 
            message: `✅ Offer broadcast initiated!\n${result.message || 'AI-generated message will be sent to WhatsApp group shortly.'}` 
          });
          setOfferData({
            phoneModel: '',
            price: '',
            features: '',
            dealType: 'new-arrival',
            images: []
          });
        } else {
          setStatus({ type: 'error', message: 'Failed to send offer. Please check your n8n webhook.' });
        }
      } catch (error) {
        setStatus({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Create Promotional Offer</h2>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Model *</label>
            <input
              type="text"
              value={offerData.phoneModel}
              onChange={(e) => setOfferData({...offerData, phoneModel: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="iPhone 15 Pro Max"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
            <input
              type="number"
              value={offerData.price}
              onChange={(e) => setOfferData({...offerData, price: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="85000"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Type</label>
            <select
              value={offerData.dealType}
              onChange={(e) => setOfferData({...offerData, dealType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="new-arrival">🆕 New Arrival</option>
              <option value="discount">💰 Special Discount</option>
              <option value="featured">⭐ Featured Deal</option>
              <option value="flash-sale">⚡ Flash Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (optional)</label>
            <textarea
              value={offerData.features}
              onChange={(e) => setOfferData({...offerData, features: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="256GB Storage, 6.7&quot; Display, 48MP Camera, 5G Ready"
              rows="4"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">AI will use these features to generate an engaging promotional message</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Images (optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Upload product images to include in the broadcast</p>
            
            {offerData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {offerData.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img.data} alt={img.name} className="w-full h-24 object-cover rounded border" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSendOffer}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MessageSquare size={16} />
                Send Offer to WhatsApp
              </>
            )}
          </button>
        </div>

        {status.message && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            status.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            )}
            <p className={`text-sm whitespace-pre-wrap ${
              status.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {status.message}
            </p>
          </div>
        )}

      </div>
    );
  };

  // ===== CustomersList PAGE COMPONENT  =====
 const CustomersList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState({ type: '', message: '' });

    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchStatus({ type: 'error', message: 'Please enter a search term' });
        return;
      }

      if (!n8nConfig.webhookUrl) {
        setSearchStatus({ type: 'error', message: 'Please configure n8n webhook URL in Settings' });
        return;
      }

      setIsSearching(true);
      setSearchStatus({ type: '', message: '' });
      setSearchResults([]);

      try {
        const searchData = {
          action: 'search_customer',
          timestamp: new Date().toISOString(),
          search: {
            query: searchQuery,
            type: searchType
          }
        };

        const response = await fetch(n8nConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(searchData)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.customers && result.customers.length > 0) {
            setSearchResults(result.customers);
            setSearchStatus({ type: 'success', message: `Found ${result.customers.length} customer(s)` });
          } else {
            setSearchStatus({ type: 'info', message: 'No customers found matching your search' });
          }
        } else {
          setSearchStatus({ type: 'error', message: 'Search failed. Please check your n8n webhook configuration.' });
        }
      } catch (error) {
        setSearchStatus({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setIsSearching(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Records</h2>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="font-semibold text-gray-800">Search Customers</h3>
          
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSearching}
            >
              <option value="name">Name</option>
              <option value="phone">Phone Number</option>
              <option value="model">Phone Model</option>
              <option value="nationalId">National ID</option>
              <option value="date">Purchase Date</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Search by ${searchType === 'name' ? 'customer name' : searchType === 'phone' ? 'phone number' : searchType === 'model' ? 'phone model' : searchType === 'nationalId' ? 'national ID' : 'date (YYYY-MM-DD)'}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSearching}
            />

            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>

          {searchStatus.message && (
            <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
              searchStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
              searchStatus.type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
              'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {searchStatus.type === 'success' ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5" /> :
               searchStatus.type === 'info' ? <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> :
               <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />}
              <span>{searchStatus.message}</span>
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Customer Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone Model</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">National ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {searchResults.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.customerName || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.phoneNumber || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.phoneBought || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.nationalId || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {customer.amount ? `KES ${customer.amount.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {customer.date ? new Date(customer.date).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </div>
    );
  };
// ===== Settings PAGE COMPONENT  =====
  const Settings = () => {
    const [localConfig, setLocalConfig] = useState(n8nConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

    const handleSaveSettings = async () => {
      setIsSaving(true);
      setSaveStatus({ type: '', message: '' });

      try {
        await saveConfig(localConfig);
        setSaveStatus({ type: 'success', message: '✅ Settings saved successfully!' });
      } catch (error) {
        setSaveStatus({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Configuration</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <input
              type="text"
              value={localConfig.shopName}
              onChange={(e) => setLocalConfig({...localConfig, shopName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Location</label>
            <input
              type="text"
              value={localConfig.location}
              onChange={(e) => setLocalConfig({...localConfig, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number for Inquiries</label>
            <input
              type="tel"
              value={localConfig.inquiryNumber}
              onChange={(e) => setLocalConfig({...localConfig, inquiryNumber: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+254712345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Group Link</label>
            <input
              type="url"
              value={localConfig.whatsappGroup}
              onChange={(e) => setLocalConfig({...localConfig, whatsappGroup: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://chat.whatsapp.com/your-group-link"
            />
            <p className="text-xs text-gray-500 mt-1">This will be shared with customers after purchase</p>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>

        {saveStatus.message && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            {saveStatus.type === 'success' ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            )}
            <p className={`text-sm ${
              saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {saveStatus.message}
            </p>
          </div>
        )}
      </div>
    );
  };


  // ===== MAIN RETURN WITH CONDITIONAL RENDERING =====
  return (
    <>
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'login' && <AuthPage mode="login" />}
      {currentView === 'signup' && <AuthPage mode="signup" />}
      {currentView === 'app' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{n8nConfig.shopName}</h1>
                  <p className="text-gray-600">Phone Shop Management System</p>
                  {currentUser && (
                    <p className="text-sm text-blue-600 mt-1">Welcome, {currentUser.fullName || currentUser.email}</p>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Lock size={16} />
                  Logout
                </button>
              </div>
              {!n8nConfig.webhookUrl && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">⚠️ Please configure your n8n webhook URL in Settings</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                <button
                  onClick={() => setActiveTab('sale')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'sale' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Phone size={20} />
                  New Sale
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package size={20} />
                  Inventory
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'offers' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare size={20} />
                  Offers
                </button>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'customers' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users size={20} />
                  Customers
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ⚙️ Settings
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'sale' && <SaleForm />}
                {activeTab === 'inventory' && <InventoryManager />}
                {activeTab === 'offers' && <OfferBroadcast />}
                {activeTab === 'customers' && <CustomersList />}
                {activeTab === 'settings' && <Settings />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhoneShopManager;