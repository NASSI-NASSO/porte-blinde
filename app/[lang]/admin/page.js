"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const emptyProductForm = {
  name: "",
  price: "",
  description: "",
  stock: "",
  image: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const isEditing = useMemo(() => Boolean(editingProductId), [editingProductId]);

  async function fetchData(tab) {
    setLoading(true);
    setError("");
    try {
      const endpoint =
        tab === "orders"
          ? "/api/admin/orders"
          : tab === "users"
            ? "/api/admin/users"
            : "/api/products";

      const res = await fetch(endpoint, { cache: "no-store" });

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await res.json();
      if (tab === "orders") setOrders(data);
      else if (tab === "users") setUsers(data);
      else setProducts(data);
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(n) {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  function handleProductChange(e) {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      // IMPORTANT: Remplacez 'votre_upload_preset' par votre upload preset Cloudinary (non signé)
      formData.append("upload_preset", "products_upload"); 

      // IMPORTANT: Remplacez 'votre_cloud_name' par votre Cloud Name Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/dmc3tdoll/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Erreur lors de l'upload de l'image");
      }

      setProductForm((prev) => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      setError(err.message || "Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
    }
  }

  function startEdit(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name ?? "",
      price: String(product.price ?? ""),
      description: product.description ?? "",
      stock: String(product.stock ?? 0),
      image: product.image ?? "",
    });
  }

  function resetProductForm() {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  }

  async function handleProductSubmit(e) {
    e.preventDefault();
    setSavingProduct(true);
    setError("");

    try {
      const payload = {
        name: productForm.name.trim(),
        price: Number(productForm.price),
        description: productForm.description.trim(),
        stock: Number(productForm.stock || 0),
        image: productForm.image.trim(),
      };

      const endpoint = isEditing
        ? `/api/products/${editingProductId}`
        : "/api/products";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible d'enregistrer le produit");
      }

      resetProductForm();
      await fetchData("products");
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDeleteProduct(productId) {
    const confirmed = window.confirm("Supprimer ce produit ?");
    if (!confirmed) return;

    setError("");
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Suppression impossible");
      }

      if (editingProductId === productId) {
        resetProductForm();
      }

      await fetchData("products");
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    }
  }

  async function handleDeleteOrder(orderId) {
    const confirmed = window.confirm("Supprimer cette commande définitivement ?");
    if (!confirmed) return;

    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Suppression impossible");
      }

      await fetchData("orders");
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-stone-600">Espace administrateur</p>
        </div>

        <div className="flex space-x-2 rounded-xl bg-stone-100 p-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-white text-stone-900 shadow"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Commandes
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "bg-white text-stone-900 shadow"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "bg-white text-stone-900 shadow"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Produits
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm">
          <p className="text-stone-500">Chargement des données...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "orders" && (
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID Commande</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Client & Livraison</th>
                    <th className="px-6 py-4 font-semibold">Articles</th>
                    <th className="px-6 py-4 font-semibold">Statut</th>
                    <th className="px-6 py-4 text-right font-semibold">Total</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-stone-500">
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/50">
                        <td className="px-6 py-4 font-mono text-xs text-stone-500">
                          {String(order.id || "").slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-stone-900">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 text-stone-900">
                          {order.user ? (
                            <div className="space-y-1">
                              <p className="font-medium">{order.user.name}</p>
                              <p className="text-xs text-stone-500">{order.user.email}</p>
                              {order.phone && <p className="text-xs text-stone-600 mt-2"><strong>Tél:</strong> {order.phone}</p>}
                              {order.address && <p className="text-xs text-stone-600"><strong>Adresse:</strong> {order.address}</p>}
                            </div>
                          ) : (
                            <span className="italic text-stone-400">Utilisateur supprimé</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-stone-600">
                           {order.items && order.items.length > 0 ? (
                             <ul className="list-disc pl-4 space-y-1">
                               {order.items.map((item, idx) => (
                                 <li key={idx}>
                                   {item.quantity}x {item.productName || "Produit inconnu"}
                                 </li>
                               ))}
                             </ul>
                           ) : (
                             <span className="text-stone-400 italic">Aucun détail</span>
                           )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-amber-800">
                          {formatPrice(order.totalPrice)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "users" && (
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nom</th>
                    <th className="px-6 py-4 font-semibold">E-mail</th>
                    <th className="px-6 py-4 font-semibold">Rôle</th>
                    <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-stone-500">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-50/50">
                        <td className="px-6 py-4 font-medium text-stone-900">{user.name}</td>
                        <td className="px-6 py-4 text-stone-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-stone-100 text-stone-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-500">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "products" && (
            <>
              <form
                onSubmit={handleProductSubmit}
                className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
              >
                <h2 className="md:col-span-2 text-lg font-semibold text-stone-900">
                  {isEditing ? "Modifier le produit" : "Ajouter un produit"}
                </h2>

                <input
                  name="name"
                  value={productForm.name}
                  onChange={handleProductChange}
                  required
                  placeholder="Nom du produit"
                  className="rounded-xl border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />

                <input
                  name="price"
                  type="number"
                  value={productForm.price}
                  onChange={handleProductChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Prix"
                  className="rounded-xl border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />

                <input
                  name="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={handleProductChange}
                  min="0"
                  placeholder="Stock"
                  className="rounded-xl border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />

                <div className="flex flex-col">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="rounded-xl border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                  />
                  {isUploading && <span className="text-sm text-stone-500 mt-1">Téléchargement en cours...</span>}
                  {productForm.image && !isUploading && (
                    <div className="mt-2">
                      <img src={productForm.image} alt="Aperçu" className="h-20 w-20 object-cover rounded-lg border border-stone-200" />
                    </div>
                  )}
                </div>

                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleProductChange}
                  placeholder="Description"
                  rows={3}
                  className="md:col-span-2 rounded-xl border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={savingProduct || isUploading}
                    className={`rounded-xl bg-amber-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-amber-700 ${
                      savingProduct || isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {savingProduct
                      ? "Enregistrement..."
                      : isUploading
                        ? "Téléchargement d'image..."
                        : isEditing
                          ? "Mettre a jour"
                          : "Ajouter"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>

              <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Nom</th>
                      <th className="px-6 py-4 font-semibold">Prix</th>
                      <th className="px-6 py-4 font-semibold">Stock</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-stone-500">
                          Aucun produit trouve.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50/50">
                          <td className="px-6 py-4 text-stone-900">{product.name}</td>
                          <td className="px-6 py-4 text-amber-800 font-semibold">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 text-stone-700">{product.stock}</td>
                          <td className="px-6 py-4 text-stone-500">
                            {formatDate(product.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(product)}
                                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
