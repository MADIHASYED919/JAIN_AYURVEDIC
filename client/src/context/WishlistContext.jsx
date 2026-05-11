import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "../axiosConfig";

const WishlistContext =
  createContext();

export const WishlistProvider = ({
  children,
}) => {

  const [wishlistIds, setWishlistIds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH =================

  const fetchWishlist = async () => {

    try {

      const res =
        await axios.get(
          "/api/wishlist"
        );

      const ids =
        res.data.items.map(
          (item) =>
            String(item.productId)
        );

      setWishlistIds(ids);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // ================= LOAD =================

  useEffect(() => {

    fetchWishlist();

  }, []);

  // ================= TOGGLE =================

  const toggleWishlist =
    async (product) => {

      const exists =
        wishlistIds.includes(
          String(product._id)
        );

      // OPTIMISTIC UPDATE

      if (exists) {

        setWishlistIds((prev) =>
          prev.filter(
            (id) =>
              id !==
              String(product._id)
          )
        );

      } else {

        setWishlistIds((prev) => [
          ...prev,
          String(product._id),
        ]);

      }

      try {

        if (exists) {

          await axios.post(
            "/api/wishlist/remove",
            {
              productId:
                product._id,
            }
          );

        } else {

          await axios.post(
            "/api/wishlist/add",
            product
          );

        }

      } catch (err) {

        console.log(err);

        fetchWishlist();

      }

    };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () =>
  useContext(WishlistContext);