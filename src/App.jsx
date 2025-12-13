import React, { useState, useEffect } from 'react';
import { Phone, Users, Package, MessageSquare, Plus, Search, Send, Loader2, CheckCircle, AlertCircle, X, Upload } from 'lucide-react';

const PhoneShopManager = () => {
  const [activeTab, setActiveTab] = useState('sale');
  const [n8nConfig, setN8nConfig] = useState({
    webhookUrl: '',
    shopName: 'Tech Mobile Store',
    location: 'Murang\'a, Kenya',
    inquiryNumber: '+254712345678',
    whatsappGroup: 'https://chat.whatsapp.com/your-group-link'
  });

  useEffect(() => {
    loadConfig();
  }, []);

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
            location: n8nConfig.location
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
            message: `✅ Sale recorded! ${result.receiptNumber ? `Receipt #${result.receiptNumber}` : ''}\n${result.message || 'Customer will receive WhatsApp message shortly.'}` 
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
              'Record Sale'
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

  const InventoryManager = () => {
    const [formData, setFormData] = useState({
      model: '',
      brand: '',
      quantity: '',
      price: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddPhone = async () => {
      if (!formData.model || !formData.brand || !formData.quantity || !formData.price) {
        setStatus({ type: 'error', message: 'Please fill in all fields' });
        return;
      }

      if (!n8nConfig.webhookUrl) {
        setStatus({ type: 'error', message: 'Please configure n8n webhook URL in Settings' });
        return;
      }

      setIsSubmitting(true);
      setStatus({ type: '', message: '' });

      try {
        const inventoryData = {
          action: 'add_inventory',
          timestamp: new Date().toISOString(),
          item: {
            ...formData,
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price)
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
          setStatus({ 
            type: 'success', 
            message: `✅ ${formData.brand} ${formData.model} added to inventory!` 
          });
          setFormData({ model: '', brand: '', quantity: '', price: '' });
        } else {
          setStatus({ type: 'error', message: 'Failed to add inventory. Please check your n8n webhook.' });
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

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
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
          <button
            onClick={handleAddPhone}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add to Inventory
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
            <p className={`text-sm ${
              status.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {status.message}
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Inventory is managed by n8n. Your workflow will handle stock tracking, low-stock alerts, and automatic updates.
          </p>
        </div>
      </div>
    );
  };

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
            location: n8nConfig.location
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
        <h2 className="text-2xl font-bold text-gray-800">Create Offer</h2>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Model</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
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
              <option value="new-arrival">New Arrival</option>
              <option value="discount">Special Discount</option>
              <option value="featured">Featured Deal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (optional)</label>
            <textarea
              value={offerData.features}
              onChange={(e) => setOfferData({...offerData, features: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="256GB Storage, 6.7&quot; Display, 48MP Camera"
              rows="4"
              disabled={isSubmitting}
            />
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
            <p className="text-xs text-gray-500 mt-1">Upload images of the phone</p>
            
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

  const CustomersList = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Records</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Users size={48} className="mx-auto text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Data Managed by n8n</h3>
          <p className="text-sm text-gray-700 mb-4">
            All customer records, sales history, and analytics are stored and managed by your n8n workflow.
          </p>
          <div className="text-left bg-white rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700">✅ Stored in Google Sheets / Database</p>
            <p className="text-sm text-gray-700">✅ Automated follow-ups & birthday wishes</p>
            <p className="text-sm text-gray-700">✅ Purchase history tracking</p>
            <p className="text-sm text-gray-700">✅ Customer segmentation & analytics</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3">Access Your Data:</h3>
          <div className="space-y-2">
            <a 
              href="https://docs.google.com/spreadsheets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <p className="font-medium text-green-800">📊 View in Google Sheets</p>
              <p className="text-sm text-gray-600">Access your customer database</p>
            </a>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-800">🔧 n8n Workflow Dashboard</p>
              <p className="text-sm text-gray-600">Configure in your n8n instance</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            <label className="block text-sm font-medium text-gray-700 mb-1">n8n Webhook URL *</label>
            <input
              type="url"
              value={localConfig.webhookUrl}
              onChange={(e) => setLocalConfig({...localConfig, webhookUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="https://your-n8n-instance.com/webhook/phone-shop"
            />
            <p className="text-xs text-gray-500 mt-1">Your n8n webhook endpoint that will receive all data</p>
          </div>

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

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3">n8n Workflow Setup Guide</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <p>Create a Webhook trigger node in n8n</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <p>Add a Switch node to handle different actions: <code className="bg-gray-100 px-1 rounded">new_sale</code>, <code className="bg-gray-100 px-1 rounded">add_inventory</code>, <code className="bg-gray-100 px-1 rounded">broadcast_offer</code></p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <p>For <strong>new_sale</strong>: Add AI node → generate thank you message → WhatsApp node → Google Sheets/Database → Email receipt</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <p>For <strong>add_inventory</strong>: Update Google Sheets/Database → Check stock levels → Send low-stock alerts if needed</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">5.</span>
              <p>For <strong>broadcast_offer</strong>: AI node → generate marketing message → WhatsApp group broadcast</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Expected Webhook Payload</h3>
          <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-xs">
{`{
  "action": "new_sale | add_inventory | broadcast_offer",
  "timestamp": "2024-12-13T10:30:00Z",
  "sale": {
    "customerName": "John Doe",
    "phoneNumber": "+254712345678",
    "phoneBought": "iPhone 13 Pro",
    "amount": 50000,
    "paymentMethod": "mpesa"
  },
  "shop": {
    "name": "Tech Mobile Store",
    "location": "Murang'a, Kenya"
  }
}`}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
<div className="max-w-4xl mx-auto">
<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
<h1 className="text-3xl font-bold text-gray-800 mb-2">{n8nConfig.shopName}</h1>
<p className="text-gray-600">Phone Shop Management System</p>
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
            activeTab === 'sale'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Phone size={20} />
          New Sale
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Package size={20} />
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'offers'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <MessageSquare size={20} />
          Offers
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'customers'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users size={20} />
          Customers
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
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
);
};
export default PhoneShopManager;