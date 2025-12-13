"use client";

import { useState, useEffect } from "react";

const DELIVERY_FEES = {
  Casablanca: 25,
  Rabat: 25,
  Salé: 25,
  Temara: 25,
  Mohammedia: 25,
  Marrakech: 35,
  Fes: 35,
  Meknes: 35,
  Tanger: 35,
  Tetouan: 35,
  Agadir: 40,
  Oujda: 40,
};

export default function OrderPage() {
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    city: "Casablanca",
    address: "",
    size: "100ml",
  });

  const perfumePrice = form.size === "100ml" ? 280 : 180;
  const deliveryFee = DELIVERY_FEES[form.city] || 40;
  const total = perfumePrice + deliveryFee;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
useEffect(() => {
  if (success) {
    const message = `Bonjour, je confirme ma commande de parfum (${form.size}). Total: ${total} MAD. Paiement à la livraison.`;
    const phone = "212772578216"; // YOUR BUSINESS NUMBER

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }
}, [success]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        product_id: 1,
        price: total,
      }),
    });

  if (res.ok) {
  setSuccess(true);

  const adminPhone = "212772578216"; // YOUR NUMBER
  const adminMessage = `Nouvelle commande 📦
Nom: ${form.customer_name}
Ville: ${form.city}
Taille: ${form.size}
Total: ${total} MAD
Téléphone: ${form.phone}`;

  window.open(
    `https://wa.me/${adminPhone}?text=${encodeURIComponent(adminMessage)}`,
    "_blank"
  );
}


    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600 text-xl font-semibold">
        Order confirmed ✅ Total: {total} MAD (Cash on Delivery)
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Order Your Perfume</h1>

        <input name="customer_name" placeholder="Full Name" value={form.customer_name} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full p-3 border rounded" />

        <select name="city" value={form.city} onChange={handleChange} className="w-full p-3 border rounded">
          {Object.keys(DELIVERY_FEES).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full p-3 border rounded" />

        <select name="size" value={form.size} onChange={handleChange} className="w-full p-3 border rounded">
          <option value="50ml">50ml – 180 MAD</option>
          <option value="100ml">100ml – 280 MAD</option>
        </select>

        <div className="text-sm text-gray-700">
          <p>Perfume: <strong>{perfumePrice} MAD</strong></p>
          <p>Delivery: <strong>{deliveryFee} MAD</strong></p>
          <p className="text-lg">Total: <strong>{total} MAD</strong></p>
        </div>

        <button disabled={loading} className="w-full bg-black text-white p-3 rounded-xl">
          {loading ? "Sending..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}
