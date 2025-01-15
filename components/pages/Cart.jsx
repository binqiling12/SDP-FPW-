import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchCartItems(userId);
  }, [navigate]);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${userId}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userId')}`, // Optional: if you implement token-based auth
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const data = await response.json();
      setCartItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/items/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`, // Optional: if you implement token-based auth
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        fetchCartItems(userId);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/items/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${userId}`, // Optional: if you implement token-based auth
        },
      });
      if (response.ok) {
        fetchCartItems(userId);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p>Your cart is empty</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border p-4 rounded">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 object-cover mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Rp {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-xl">
                Rp {calculateTotal().toLocaleString()}
              </span>
            </div>
            <button
              className="w-full mt-4 bg-green-500 text-white py-2 rounded"
              onClick={() => {/* Implement checkout logic */}}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
