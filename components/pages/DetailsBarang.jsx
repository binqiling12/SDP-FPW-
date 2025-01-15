import React from "react";
import "./DetailsBarang.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DetailsBarang = ({ selectedItem }) => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  if (!selectedItem) {
    return <p>Item tidak ditemukan.</p>;
  }

  const addToCart = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/carts`, {
        user_id: userId,
        total_price: selectedItem.price * 1 // Assuming quantity is 1 for simplicity
      });

      const cartId = response.data.id;

      await axios.post(`${API_URL}/api/cart-items`, {
        cart_id: cartId,
        product_id: selectedItem.product_id,
        quantity: 1
      });

      alert("Barang berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert("Error adding to cart");
    }
  };

  return (
    <div className="details-barang">
      <h2>Detail Barang</h2>
      <div className="item-details">
        <img
          src={selectedItem.imageUrl}
          alt={selectedItem.name}
          className="item-image"
        />
        <h3 className="item-name">{selectedItem.name}</h3>
        <p className="item-price">{selectedItem.price}</p>
        <p className="item-description">{selectedItem.description}</p>
        <p className="item-stock">Stok: {selectedItem.stock}</p>
        <button onClick={addToCart} className="add-to-cart-button">
          Add to Cart
        </button>
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
};

export default DetailsBarang;
