import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./EditBarang.css";

const EditBarang = ({ itemToEdit, onEditItem, onBack }) => {
  // Mengisi state awal dengan data item yang akan diedit
  const [name, setName] = useState(itemToEdit.name || "");
  const [imageUrl, setImageUrl] = useState(itemToEdit.imageUrl || "");
  const [price, setPrice] = useState(itemToEdit.price || "");
  const [description, setDescription] = useState(itemToEdit.description || "");
  const [stock, setStock] = useState(itemToEdit.stock || "");

  const handleEdit = async (e) => {
    e.preventDefault();
    const updatedItem = {
      ...itemToEdit,
      name,
      imageUrl,
      price,
      description,
      stock,
    };

    try {
      await axios.put(`http://localhost:3000/api/products/${itemToEdit.product_id}`, updatedItem);
      onEditItem(updatedItem);
      alert("Barang berhasil diupdate!");
    } catch (error) {
      console.error('Update error:', error);
      alert("Gagal mengupdate barang. Silakan coba lagi.");
    }
  };

  return (
    <div className="edit-barang">
      <h2>Edit Barang</h2>
      <form onSubmit={handleEdit}>
        <input
          type="text"
          placeholder="Nama Barang"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL Gambar"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Stok"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit" className="editBtn">
          Edit
        </button>
        <button type="button" className="backBtn" onClick={onBack}>
          Back
        </button>
      </form>
    </div>
  );
};

export default EditBarang;
