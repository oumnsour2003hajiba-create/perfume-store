"use client";

import { useState } from "react";

// --- Configuration ---
// Your WhatsApp number (WITHOUT the '+' sign) for the wa.me link.
// The client will send the order details to this number.
const ADMIN_PHONE_NUMBER_WA_ME = "212772578216"; 

const DELIVERY_FEES = {
  Casablanca: 25, Rabat: 25, Salé: 25, Temara: 25, Mohammedia: 25,
  Marrakech: 35, Fes: 35, Meknes: 35, Tanger: 35, Tetouan: 35,
  Agadir: 40, Oujda: 40,
};

export default function OrderPage() {
  const [form, setForm] = useState({
    customer_name: "", phone: "", city: "Casablanca",
    address: "", size: "100ml",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null); 

  const perfumePrice = form.size === "100ml" ? 280 : 180;
  const deliveryFee = DELIVERY_FEES[form.city] || 40;
  const total = perfumePrice + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. DATA SAVING (Database)
    try {
      const dbResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product_id: 1, 
          price: total, 
        }),
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json();
        setError(`Failed to save order. Error: ${errorData.error || 'Server error'}`);
        setLoading(false);
        return; 
      }
      
      // DB save successful
      setSuccess(true);
      setLoading(false);

      // 2. WHATSAPP REDIRECT (Admin Notification)
      const adminMessage = `
🛍️ Nouvelle commande – Perfume Store
---------------------------------
👤 Client: ${form.customer_name}
📞 Tél: ${form.phone}
📍 Ville: ${form.city}
🏠 Adresse: ${form.address}
💧 Format: ${form.size}
💵 Total: ${total} MAD (Paiement à la livraison)
      `;

      // Redirect the client to WhatsApp to send the message to YOU.
      window.location.href = `https://wa.me/${ADMIN_PHONE_NUMBER_WA_ME}?text=${encodeURIComponent(
        adminMessage
      )}`;

    } catch (err) {
      console.error("Submission Error:", err);
      setError("Network or server connection failed. Please try again.");
      setLoading(false);
    }
  };

  // --- SUCCESS STATE ---
  if (success) {
    // Confirmation link for the client to save details to their OWN chat
    const clientConfirmationMessage = `
✅ Order Confirmed!
-----------------------
*Perfume Store* confirms your order of 1x ${form.size} Perfume.
Total: ${total} MAD
Delivery to: ${form.city}, ${form.address}
*We will contact you shortly to confirm delivery time (24-48h).*
    `;
    const clientWaMeLink = `https://wa.me/${form.phone}?text=${encodeURIComponent(
      clientConfirmationMessage
    )}`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4 text-center">
            <h1 className="text-3xl font-bold text-green-600">
                ✅ Commande Confirmée!
            </h1>
            <p className="text-gray-700 text-lg">
                Votre commande a été enregistrée dans notre système et la notification WhatsApp est prête.
            </p>
            <p className="text-xl font-bold">
                Total: {total} MAD <br />
                <span className="text-sm font-normal text-gray-500">Paiement à la livraison.</span>
            </p>
            
            <hr />
            
            <h2 className="text-md font-semibold text-gray-800 mt-4">
                Sauvegardez vos détails de commande:
            </h2>
            <a 
                href={clientWaMeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-green-500 text-white p-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
                💾 Recevoir la Confirmation sur WhatsApp
            </a>
            <p className="text-xs text-gray-500 mt-2">
                (Cliquez et appuyez sur 'Envoyer' pour enregistrer le message sur votre téléphone)
            </p>
        </div>
      </div>
    );
  }

  // --- FORM RENDER ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Order Your Perfume
        </h1>

        {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded border border-red-300">
                Erreur: {error}
            </div>
        )}
        
        {/* --- INPUTS --- */}
        <input name="customer_name" placeholder="Full Name" value={form.customer_name} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input name="phone" placeholder="Phone Number (e.g., 2126xxxxxxxx)" value={form.phone} onChange={handleChange} required className="w-full p-3 border rounded" />
        <select name="city" value={form.city} onChange={handleChange} className="w-full p-3 border rounded">
          {Object.keys(DELIVERY_FEES).map((city) => (<option key={city} value={city}>{city}</option>))}
        </select>
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full p-3 border rounded" />
        <select name="size" value={form.size} onChange={handleChange} className="w-full p-3 border rounded">
          <option value="50ml">50ml – 180 MAD</option>
          <option value="100ml">100ml – 280 MAD</option>
        </select>

        <div className="text-sm text-gray-700">
          <p>Perfume: <strong>{perfumePrice} MAD</strong></p>
          <p>Delivery: <strong>{deliveryFee} MAD</strong></p>
          <p className="text-lg font-bold">Total: <strong>{total} MAD</strong></p>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Saving and Sending..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}