import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'
import type { CartItem, Guitarra, GuitarId } from '../types'
export const useCart = () => {



  const initialState = (): CartItem[] => {
    const localStorageItem = localStorage.getItem('cart')
    return localStorageItem ? JSON.parse(localStorageItem) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialState)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function appToCart(item: Guitarra) {
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id)
    if (itemExist >= 0) {
      const updateCart = [...cart]
      updateCart[itemExist].quantity++
      setCart(updateCart)
    } else {
      const newItem: CartItem = { ...item, quantity: 1 }
      setCart([...cart, newItem])
    }


  }
  function removeFromCart(id: GuitarId) {
    setCart(prevCasrt => prevCasrt.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id: GuitarId) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity < 5) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updateCart)
  }

  function decrementQuantity(id: GuitarId) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > 0) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updateCart)
  }

  function clearCart() {
    setCart([])
  }
  //state derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart])
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

  return {
    data,
    cart,
    appToCart,
    removeFromCart,
    decrementQuantity,
    clearCart,
    increaseQuantity,
    isEmpty,
    cartTotal

  }
}


