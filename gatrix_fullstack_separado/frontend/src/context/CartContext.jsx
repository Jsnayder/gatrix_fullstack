import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'gatrix_cart'

function initialCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [] } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCart)

  const persist = (next) => {
    setItems(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + Number(item.precio_unitario) * item.quantity, 0),
    add(product) {
      const current = items.find((item) => item.id_producto === product.id_producto)
      const next = current
        ? items.map((item) => item.id_producto === product.id_producto ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }]
      persist(next)
    },
    remove(id) { persist(items.filter((item) => item.id_producto !== id)) },
    clear() { persist([]) }
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
