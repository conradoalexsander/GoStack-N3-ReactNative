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

          console.log(`storage inicial: \n ${JSON.stringify(products)}`);


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
      try {
          await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(products)
        );

      } catch (error) {
        // Error saving data
        console.log(error);

      }



  } else {
    increment(product.id);
  }

  }, [products, setProducts]);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART

   const product = products.filter(product => product.id === id)[0];
   const updatedProducts = products;
   const elementIndex =  updatedProducts.indexOf(product)
   let {quantity} = product;

   quantity += 1;
   updatedProducts[elementIndex] = {...updatedProducts[elementIndex], quantity}

   setProducts(updatedProducts);


   try {
    await AsyncStorage.setItem(
    '@GoMarketplace:products',
    JSON.stringify(products)
  );

} catch (error) {
  // Error saving data
  console.log(error);

}
  }, [products, setProducts]);

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


      try {
        await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products)
      );

    } catch (error) {
      // Error saving data
      console.log(error);
    }

    } else {
      return;
    }


  }, [products, setProducts]);

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
