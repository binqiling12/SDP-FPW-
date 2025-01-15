import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import "./AddBarang.css";

const schema = Joi.object({
  name: Joi.string().trim().required().min(1).messages({
    'string.empty': 'Nama barang harus diisi',
    'string.min': 'Nama barang harus diisi',
    'any.required': 'Nama barang harus diisi'
  }),
  image: Joi.string().trim().required().messages({
    'string.empty': 'URL gambar harus diisi',
    'any.required': 'URL gambar harus diisi'
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Harga harus berupa angka',
    'number.positive': 'Harga harus lebih dari 0',
    'any.required': 'Harga harus diisi'
  }),
  description: Joi.string().trim().required().min(1).messages({
    'string.empty': 'Deskripsi harus diisi',
    'string.min': 'Deskripsi harus diisi',
    'any.required': 'Deskripsi harus diisi'
  }),
  stock: Joi.number().min(0).required().messages({
    'number.base': 'Stok harus berupa angka',
    'number.min': 'Stok tidak boleh negatif',
    'any.required': 'Stok harus diisi'
  }),
  category_id: Joi.number().required().messages({
    'number.base': 'Kategori harus dipilih',
    'any.required': 'Kategori harus dipilih'
  })
});

const AddBarang = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: joiResolver(schema),
    mode: 'all'
  });

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = {
        name: data.name,
        stock: parseInt(data.stock),
        price: parseFloat(data.price),
        image: data.image,
        description: data.description,
        category_id: parseInt(data.category_id)
      };

      const response = await axios.post('http://localhost:3000/api/products', formData);
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        reset(); // Reset form after successful submission
      }
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'Terjadi kesalahan saat menambah produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-barang">
      <h2>Tambah Barang</h2>
      {submitError && <div className="error-message">{submitError}</div>}
      {submitSuccess && <div className="success-message">Produk berhasil ditambahkan!</div>}
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <input
          type="text"
          placeholder="Nama Barang"
          {...register("name")}
        />
        {errors.name && <span className="error-message">{errors.name.message}</span>}

        <input
          type="text"
          placeholder="URL Gambar"
          {...register("image")}
        />
        {errors.image && <span className="error-message">{errors.image.message}</span>}

        <input
          type="number"
          placeholder="Harga"
          {...register("price")}
        />
        {errors.price && <span className="error-message">{errors.price.message}</span>}

        <textarea
          placeholder="Deskripsi"
          {...register("description")}
        ></textarea>
        {errors.description && <span className="error-message">{errors.description.message}</span>}

        <input
          type="number"
          placeholder="Stok"
          {...register("stock")}
        />
        {errors.stock && <span className="error-message">{errors.stock.message}</span>}

        <select {...register("category_id")}>
          <option value="">Pilih Kategori</option>
          <option value="1">Tas</option>
          <option value="2">Sepatu</option>
          <option value="3">Kaos Kaki</option>
        </select>
        {errors.category_id && <span className="error-message">{errors.category_id.message}</span>}

        <button 
          type="submit" 
          disabled={isSubmitting || !isValid}
          className={isSubmitting || !isValid ? 'button-disabled' : ''}
        >
          {isSubmitting ? 'Menambahkan...' : 'Tambah'}
        </button>
      </form>
    </div>
  );
};

export default AddBarang;
