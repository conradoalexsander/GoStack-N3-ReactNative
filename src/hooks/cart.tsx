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


        const storedData= await AsyncStorage.getItem(
          '@GoMarketplace:products'
        );

        if(storedData){
          const storedProducts = JSON.parse(storedData);
          setProducts(storedProducts);
        }

    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART

    if(products.indexOf(product) < 0){

      product.quantity=0
      setProducts([...products, product]);

      AsyncStorage.setItem('@GoMarketplace:products', JSON.stringify(products));

  }

  console.log(products);



  }, []);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
   const product = products.filter(product => product.id === id)[0];

   const updatedProducts = products;
   const elementIndex =  updatedProducts.indexOf(product)
   let {quantity} = product;
   quantity += 1;
   updatedProducts[elementIndex] = {...updatedProducts[elementIndex], quantity}
   setProducts(updatedProducts);
  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
    const product = products.filter(product => product.id === id)[0];

    const updatedProducts = products;
    const elementIndex =  updatedProducts.indexOf(product)
    let {quantity} = product;

    if(quantity>0){
      quantity -= 1;
      updatedProducts[elementIndex] = {...updatedProducts[elementIndex], quantity}
      setProducts(updatedProducts);
    } else {
      return;
    }


  }, []);

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
