import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {

    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    //  await AsyncStorage.removeItem('@GoMarketplace:products');
      try {
        const storedData = await AsyncStorage.getItem('@GoMarketplace:products');
          // We have data!!
          storedData !== null ? setProducts([...JSON.parse(storedData)]) : null;

      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART

    if(products.some(item => item.id === product.id) === false){

      product.quantity=1;
      setProducts([...products, product]);

          await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(products)
        );

    } else {

    increment(product.id);

    }

  }, [products]);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART

    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
    );
    setProducts(updatedProducts);

    await AsyncStorage.setItem(
    '@GoMarketplace:products',
    JSON.stringify(products)
    );

    console.log(products);

  }, [products]);



  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART

    const updatedProducts = products
    .map(p =>
      p.id === id ? { ...p, quantity: p.quantity - 1 } : p,
    )
    .filter(item => item.quantity>0);

    setProducts(updatedProducts);

    await AsyncStorage.setItem(
      '@GoMarketplace:products',
      JSON.stringify(products)
    );


  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
