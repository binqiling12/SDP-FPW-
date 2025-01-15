import React, { useState } from "react";
import axios from 'axios';
import EditBarang from "./EditBarang";
import "./HomeAdmin.css";

const HomeAdmin = ({ items, setItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      const updatedItems = items.filter((item) => item.product_id !== id);
      setItems(updatedItems);
      alert("Barang berhasil dihapus!");
    } catch (error) {
      console.error('Delete error:', error);
      alert("Gagal menghapus barang. Silakan coba lagi.");
    }
  };

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setIsEditing(true);
  };

  const handleEditItem = (updatedItem) => {
    const updatedItems = items.map((item) =>
      item.product_id === updatedItem.product_id ? updatedItem : item
    );
    setItems(updatedItems);
    setIsEditing(false);
    alert("Barang berhasil diupdate!");
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditBarang
        itemToEdit={itemToEdit}
        onEditItem={handleEditItem}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="home-admin">
      <h2 className="welcome">Welcome, Admin!</h2>
      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.product_id}>
            <img src={item.image} alt={item.name} className="item-image" />
            <h3 className="item-name">{item.name}</h3>
            <p className="item-price">{item.price}</p>
            <button
              className="edit-button"
              onClick={() => handleEditClick(item)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(item.product_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeAdmin;
