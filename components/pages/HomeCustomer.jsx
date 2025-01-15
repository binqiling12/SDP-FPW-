import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeCustomer.css";

const HomeCustomer = ({ username, items, setSelectedItem }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (item) => {
    setSelectedItem(item);
    navigate("/details");
  };

  return (
    <div className="home-customer">
      <h2 className="welcome">Welcome, {username}!</h2>
      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} className="item-image" />
            <h3 className="item-name">{item.name}</h3>
            <p className="item-price">{item.price}</p>
            <button
              className="details-button"
              onClick={() => handleDetailsClick(item)}
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCustomer;
