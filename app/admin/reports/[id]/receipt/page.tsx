"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatIDR } from "@/data/utils";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

interface ReceiptPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const resolvedParams = use(params);
  const reportId = parseInt(resolvedParams.id, 10);

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);

      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from("reports")
            .select("*, items:report_items(*)")
            .eq("id", reportId)
            .single();

          if (data) {
            setReport(data);
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }

      // Check localStorage
      try {
        const local = JSON.parse(localStorage.getItem("sb_reports") || "[]");
        const found = local.find((r: any) => r.id === reportId);
        if (found) {
          setReport(found);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }

      setLoading(false);
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-gray-500">Memuat struk...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">Laporan tidak ditemukan.</p>
        <Link
          href="/admin/reports"
          className="text-red-600 font-semibold hover:underline"
        >
          &larr; Kembali ke Laporan
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8">
      <div className="container mx-auto max-w-xl">
        {/* Tombol Aksi */}
        <div className="print:hidden mb-6 text-center space-x-3">
          <Link
            href="/admin/reports"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm font-semibold inline-block"
          >
            &larr; Kembali ke Laporan
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm font-semibold cursor-pointer"
          >
            Cetak Struk
          </button>
        </div>

        {/* Isi Struk */}
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
              SB Jaya
            </h1>
            <p className="text-sm text-gray-500">Jl. Raya Demak-Kudus no.29</p>
          </div>

          <div className="flex justify-between text-sm mb-4 text-gray-700">
            <div>
              <p>
                <strong>No. Laporan:</strong> #{report.id}
              </p>
              <p>
                <strong>Kasir:</strong> {report.cashier_name || "Kasir SB Jaya"}
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>Tanggal:</strong>{" "}
                {new Date(report.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Customer:</strong> {report.customer_name || "-"}
              </p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-t-2 border-gray-300">
                <th className="p-2 text-left font-semibold text-gray-700">
                  PRODUK
                </th>
                <th className="p-2 text-right font-semibold text-gray-700">
                  HARGA
                </th>
                <th className="p-2 text-right font-semibold text-gray-700">
                  JML
                </th>
                <th className="p-2 text-right font-semibold text-gray-700">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {report.items?.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-2 text-gray-800 font-medium">
                    {item.product_name}
                  </td>
                  <td className="p-2 text-right text-gray-600">
                    {formatIDR(item.price)}
                  </td>
                  <td className="p-2 text-right text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="p-2 text-right text-gray-900 font-semibold">
                    {formatIDR(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t-2 border-gray-300">
                <td colSpan={3} className="p-2 text-right text-gray-800">
                  GRAND TOTAL
                </td>
                <td className="p-2 text-right text-red-600 text-base">
                  {formatIDR(report.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>

          <p className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-dashed">
            Terima kasih telah berbelanja di SB Jaya!
          </p>
        </div>
      </div>
    </div>
  );
}
