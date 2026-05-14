import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// --- Helper localStorage ---
const saveToStorage = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }
};

// --- Async Thunks ---

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue, getState, dispatch }) => {
  try {
    const hasToken = typeof document !== "undefined" && document.cookie.includes("token=");
    if (!hasToken) {
      return rejectWithValue("not_authenticated");
    }
    const res = await fetch("/api/cart");
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();
    const serverItems = data.items || [];

    // Auto-sync logic
    const state = getState();
    const localItems = state.cart.items;

    if (serverItems.length === 0 && localItems.length > 0) {
      console.log("Server cart empty, local cart has items. Syncing...");
      await dispatch(syncCart(localItems));
      // Re-fetch to get the server IDs
      const res2 = await fetch("/api/cart");
      const data2 = await res2.json();
      return data2.items || [];
    }

    return serverItems;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (product, { rejectWithValue }) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      return product;
    } catch (error) {
      return product;
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (productId, { rejectWithValue }) => {
    try {
      await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      return productId;
    } catch (error) {
      return productId;
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity }),
      });
      return { id, quantity };
    } catch (error) {
      return { id, quantity };
    }
  }
);
export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (items, { rejectWithValue }) => {
    try {
      const hasToken = typeof document !== "undefined" && document.cookie.includes("token=");
      if (!hasToken || items.length === 0) return;

      // On envoie chaque item au serveur. 
      // Idéalement il faudrait une route batch, mais on utilise POST /api/cart existant.
      for (const item of items) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
        });
      }
    } catch (error) {
      console.error("Sync failed", error);
    }
  }
);
export const placeOrder = createAsyncThunk("cart/placeOrder", async ({ phone, address }, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/orders", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, address })
    });
    if (!res.ok) {
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login";
        throw new Error("Veuillez vous connecter pour commander");
      }
      throw new Error(data.error || "Échec de la commande");
    }
    return await res.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// --- Initial State ---

const initialState = {
  items: [],
  loading: false,
  error: null,
  orderSuccess: null,
};

// --- Slice ---

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image } = action.payload;
      const existing = state.items.find((i) => String(i.id) === String(id));
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ id, name, price, image, quantity: 1 });
      }
      saveToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => String(i.id) !== String(action.payload));
      saveToStorage(state.items);
    },
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => String(i.id) === String(id));
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => String(i.id) !== String(id));
        } else {
          item.quantity = quantity;
        }
      }
      saveToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.orderSuccess = null;
      saveToStorage(state.items);
    },
    loadLocalCart: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("cart_items");
        if (saved) {
          try {
            state.items = JSON.parse(saved);
          } catch (e) {
            state.items = [];
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && (action.payload.length > 0 || state.items.length === 0)) {
          state.items = action.payload
            .filter((item) => item.product)
            .map((item) => ({
              ...item.product,
              quantity: item.quantity,
              cartItemId: item.id,
            }));
          saveToStorage(state.items);
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
      })
      // addToCartAsync
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const product = action.payload;
        const existing = state.items.find((i) => String(i.id) === String(product.id));
        if (existing) {
          existing.quantity += 1;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
        saveToStorage(state.items);
      })
      // removeFromCartAsync
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => String(i.id) !== String(action.payload));
        saveToStorage(state.items);
      })
      // updateQuantityAsync
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const item = state.items.find((i) => String(i.id) === String(id));
        if (item) {
          if (quantity <= 0) {
            state.items = state.items.filter((i) => String(i.id) !== String(id));
          } else {
            item.quantity = quantity;
          }
        }
        saveToStorage(state.items);
      })
      // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.orderSuccess = action.payload.orderId;
        saveToStorage(state.items);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart, loadLocalCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
