"use client";
import { useEffect, useState } from "react";
import axios from "axios";


export default function ProduitsPage() {
  const [productss, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

   return (
    <div>
      <h1>Liste des produits</h1>

      {productss.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price} DH</p>
        </div>
      ))}
    </div>
  );
}