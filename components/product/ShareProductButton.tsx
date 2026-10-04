"use client";

import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatIDR } from "@/data/utils";

interface ShareProductButtonProps {
  productName: string;
  productPrice: number;
  partNumber?: string;
}

export default function ShareProductButton({
  productName,
  productPrice,
  partNumber,
}: ShareProductButtonProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Tautan produk berhasil disalin");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin tautan");
    }
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const partText = partNumber ? ` (${partNumber})` : "";
    const message = `Halo, saya menemukan produk ini di Katalog SB Jaya:\n\n*${productName}*${partText}\nHarga: ${formatIDR(
      productPrice
    )}\n\nLihat selengkapnya di:\n${url}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
        Bagikan:
      </span>
      <button
        type="button"
        onClick={handleShareWhatsApp}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-xs font-medium transition-colors"
        title="Bagikan ke WhatsApp"
      >
        <Share2 className="w-3.5 h-3.5" />
        WhatsApp
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded text-xs font-medium transition-colors"
        title="Salin tautan produk"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-gray-500" />
        )}
        {copied ? "Tersalin" : "Salin Tautan"}
      </button>
    </div>
  );
}
