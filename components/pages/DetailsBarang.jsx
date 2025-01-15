import React from "react";
import "./DetailsBarang.css";
import { useNavigate } from "react-router-dom";

const DetailsBarang = ({ selectedItem }) => {
  const navigate = useNavigate();

  if (!selectedItem) {
    return <p>Item tidak ditemukan.</p>;
  }

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
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
};

export default DetailsBarang;
