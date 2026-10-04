"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface FavoriteButtonProps {
  productId: number;
  initialFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({
  productId,
  initialFavorited = false,
  className = "",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Check favorite status in Supabase
        supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setIsFavorited(true);
          });
      } else {
        // Fallback to localStorage for guest wishlist
        try {
          const localFavs = JSON.parse(localStorage.getItem("sb_favorites") || "[]");
          if (Array.isArray(localFavs) && localFavs.includes(productId)) {
            setIsFavorited(true);
          }
        } catch {
          // ignore
        }
      }
    });
  }, [productId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Guest local storage toggle
      try {
        const localFavs: number[] = JSON.parse(localStorage.getItem("sb_favorites") || "[]");
        let updated: number[];
        if (localFavs.includes(productId)) {
          updated = localFavs.filter((id) => id !== productId);
          setIsFavorited(false);
        } else {
          updated = [...localFavs, productId];
          setIsFavorited(true);
        }
        localStorage.setItem("sb_favorites", JSON.stringify(updated));
        window.dispatchEvent(new Event("favorites-updated"));
      } catch {
        // ignore
      }
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (isFavorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      setIsFavorited(false);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_id: productId });
      setIsFavorited(true);
    }

    setLoading(false);
    window.dispatchEvent(new Event("favorites-updated"));
  };

  if (!isMounted) {
    return (
      <Link
        href="/login"
        className={`w-full block text-center bg-gray-300 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-400 transition-colors text-sm ${className}`}
      >
        Login to Fav
      </Link>
    );
  }

  // If user is guest, show "Login to Fav" linking to /login as in Laravel,
  // but allow clicking to also bookmark locally or sign in
  if (!user) {
    return (
      <Link
        href="/login"
        className={`w-full block text-center bg-gray-300 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-400 transition-colors text-sm ${className}`}
      >
        Login to Fav
      </Link>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`w-full font-bold py-2 rounded-md transition-colors text-sm ${
        isFavorited
          ? "bg-gray-500 text-white hover:bg-gray-600"
          : "bg-red-600 text-white hover:bg-red-700"
      } ${className}`}
    >
      {loading ? "..." : isFavorited ? "Remove from Fav" : "Add to Fav"}
    </button>
  );
}
