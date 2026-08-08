'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Product, fetchWishlist, toggleWishlistApi, syncWishlistApi, deleteWishlistApi } from './api';

interface WishlistContextType {
  wishlistProductIds: string[];
  wishlistProducts: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
  wishlistCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const token = (session?.user as any)?.accessToken as string | undefined;

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initial load from localStorage (for guest) or Backend (for logged-in user)
  useEffect(() => {
    let isMounted = true;

    async function initWishlist() {
      setIsLoading(true);

      if (token) {
        // Authenticated user
        try {
          // Check if there are guest items stored in localStorage to sync
          const savedGuest = localStorage.getItem('olinbuy_wishlist');
          let guestIds: string[] = [];
          if (savedGuest) {
            try {
              const parsed: Product[] = JSON.parse(savedGuest);
              guestIds = parsed.map((p) => p._id);
            } catch (e) {
              console.error('Failed to parse guest wishlist for sync', e);
            }
          }

          if (guestIds.length > 0) {
            await syncWishlistApi(guestIds, token);
            localStorage.removeItem('olinbuy_wishlist');
          }

          // Fetch full wishlist from DB
          const res = await fetchWishlist(token);
          if (isMounted) {
            setWishlistProducts(res.products || []);
            setWishlistProductIds(res.productIds || []);
          }
        } catch (err) {
          console.error('Error fetching backend wishlist:', err);
        }
      } else {
        // Guest user: load from localStorage
        const saved = localStorage.getItem('olinbuy_wishlist');
        if (saved) {
          try {
            const parsed: Product[] = JSON.parse(saved);
            if (isMounted) {
              setWishlistProducts(parsed);
              setWishlistProductIds(parsed.map((p) => p._id));
            }
          } catch (e) {
            console.error('Failed to parse local wishlist', e);
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
        setIsLoaded(true);
      }
    }

    initWishlist();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Save to localStorage when guest updates items
  useEffect(() => {
    if (isLoaded && !token) {
      localStorage.setItem('olinbuy_wishlist', JSON.stringify(wishlistProducts));
    }
  }, [wishlistProducts, isLoaded, token]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistProductIds.includes(productId);
    },
    [wishlistProductIds]
  );

  const toggleWishlist = async (product: Product) => {
    const isSaved = isInWishlist(product._id);

    // Optimistic UI Update
    if (isSaved) {
      setWishlistProducts((prev) => prev.filter((p) => p._id !== product._id));
      setWishlistProductIds((prev) => prev.filter((id) => id !== product._id));
    } else {
      setWishlistProducts((prev) => [product, ...prev]);
      setWishlistProductIds((prev) => [product._id, ...prev]);
    }

    if (token) {
      try {
        const res = await toggleWishlistApi(product._id, token);
        setWishlistProductIds(res.productIds);
      } catch (err) {
        console.error('Error toggling wishlist item on server:', err);
        // Rollback on failure
        if (isSaved) {
          setWishlistProducts((prev) => [product, ...prev]);
          setWishlistProductIds((prev) => [product._id, ...prev]);
        } else {
          setWishlistProducts((prev) => prev.filter((p) => p._id !== product._id));
          setWishlistProductIds((prev) => prev.filter((id) => id !== product._id));
        }
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const targetProduct = wishlistProducts.find((p) => p._id === productId);

    // Optimistic Update
    setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
    setWishlistProductIds((prev) => prev.filter((id) => id !== productId));

    if (token) {
      try {
        const res = await deleteWishlistApi(productId, token);
        setWishlistProductIds(res.productIds);
      } catch (err) {
        console.error('Error deleting item from wishlist on server:', err);
        // Rollback
        if (targetProduct) {
          setWishlistProducts((prev) => [targetProduct, ...prev]);
          setWishlistProductIds((prev) => [productId, ...prev]);
        }
      }
    }
  };

  const clearWishlist = () => {
    setWishlistProducts([]);
    setWishlistProductIds([]);
    if (!token) {
      localStorage.removeItem('olinbuy_wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProductIds,
        wishlistProducts,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlistProductIds.length,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
