import "./App.css";
import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Update this line

import Navbar from "../components/Navbar";
import HomeCustomer from "../components/pages/HomeCustomer";
import HomeAdmin from "../components/pages/HomeAdmin";
import AddBarang from "../components/pages/AddBarang";
import EditBarang from "../components/pages/EditBarang";
import DetailsBarang from "../components/pages/DetailsBarang";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import Cart from "../components/pages/Cart";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  // Add console logging for state changes
  useEffect(() => {
    console.log("Current state:");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("role:", role);
    console.log("username:", username);
    console.log("users:", users);
    console.log("items:", items);
    console.log("selectedItem:", selectedItem);
  }, [isLoggedIn, role, username, users, items, selectedItem]);

  // Simplified useEffects with concise axios calls
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setItems(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleLogin = async (username, password) => {
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
      setRole("admin");
      localStorage.setItem('userId', 'admin');
      navigate("/");
      return true;
    } else {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${username}`);
        const user = response.data.data;

        if (user) {
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (isPasswordMatch) {
            setIsLoggedIn(true);
            setRole(user.role_name.toLowerCase());
            setUsername(username);
            localStorage.setItem('userId', user.user_id);
            navigate("/");
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error during login:', error);
        return false;
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("");
    setUsername("");
    localStorage.removeItem('userId'); // Add this line
    navigate("/");
  };

  // Simplified handlers with concise axios calls
  

  const addItem = async (newItem) => {
    try {
      const response = await axios.post('http://localhost:3000/api/products', newItem);
      setItems([...items, { ...newItem, product_id: response.data.data.id }]);
      alert("Barang berhasil ditambahkan!");
      navigate("/");
    } catch (error) {
      alert("Error adding item");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${itemId}`);
      setItems(prev => prev.filter(item => item.product_id !== itemId));
      alert("Barang berhasil dihapus!");
    } catch (error) {
      alert("Error deleting item");
    }
  };

  const editItem = async (updatedItem) => {
    try {
      await axios.put(`http://localhost:3000/api/products/${updatedItem.product_id}`, updatedItem);
      setItems(prev => prev.map(item => 
        item.product_id === updatedItem.product_id ? updatedItem : item
      ));
      alert("Barang berhasil diubah!");
      navigate("/");
    } catch (error) {
      alert("Error updating item");
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} role={role} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              role === "admin" ? (
                <HomeAdmin
                  items={items}
                  setItems={setItems}
                  setSelectedItem={setSelectedItem}
                  onDeleteItem={deleteItem}
                  role={role} // Pass the role prop
                />
              ) : (
                <HomeCustomer
                  username={username}
                  items={items}
                  setSelectedItem={setSelectedItem}
                />
              )
            ) : null
          }
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} users={users} />}
        />
        <Route
          path="/register"
          element={<Register users={users} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add-barang" element={<AddBarang onAddItem={addItem} />} />
        <Route
          path="/edit-barang"
          element={
            <EditBarang selectedItem={selectedItem} onEditItem={editItem} />
          }
        />
        <Route
          path="/details"
          element={<DetailsBarang selectedItem={selectedItem} />}
        />
      </Routes>
    </div>
  );
}

export default App;
