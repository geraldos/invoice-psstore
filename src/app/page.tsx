"use client";

import React, { useState, useRef } from "react";
import { toJpeg } from "html-to-image";
import {
  Download,
  Plus,
  Trash2,
  FileText,
  User,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Check,
  Sparkles,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

const formatRupiah = (amount: number): string => {
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
};

const formatQty = (qty: number): string => {
  if (!qty || qty <= 0) return "00";
  return qty < 10 ? `0${qty}` : `${qty}`;
};

const DEFAULT_ITEMS: InvoiceItem[] = [
  { id: "1", description: "JERSEY HOME PS SPORT", qty: 5, price: 150000 },
  { id: "2", description: "SEPATU FUTSAL PRO", qty: 2, price: 350000 },
  { id: "3", description: "KAOS KAKI OLAHRAGA", qty: 10, price: 35000 },
  { id: "4", description: "TAS GYM WATERPROOF", qty: 3, price: 120000 },
];

export default function InvoiceGeneratorPage() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Dynamic Buyer ("Bill To") State
  const [buyerName, setBuyerName] = useState("OLIVIA WILSON");
  const [buyerAddress, setBuyerAddress] = useState(
    "Jl. Raya Pondok Gede No. 12, Bekasi"
  );
  const [buyerPhone, setBuyerPhone] = useState("+62 812-3456-7890");

  // Dynamic Invoice Metadata State
  const [invoiceNumber, setInvoiceNumber] = useState("#1234");
  const [invoiceDate, setInvoiceDate] = useState("19 OKTOBER 2026");
  const [dueDate, setDueDate] = useState("19 NOVEMBER 2026");
  const [showDueDate, setShowDueDate] = useState(true);

  // Payment Method State (Optional / Editable)
  const [showPaymentMethod, setShowPaymentMethod] = useState(true);
  const [bankName, setBankName] = useState("Transfer Bank BCA");
  const [accountName, setAccountName] = useState("PS SPORT");
  const [accountNumber, setAccountNumber] = useState("+62 855-1090-808");

  // Dynamic Items State
  const [items, setItems] = useState<InvoiceItem[]>(DEFAULT_ITEMS);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      qty: 1,
      price: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, [field]: value };
      })
    );
  };

  const handleReset = () => {
    setBuyerName("OLIVIA WILSON");
    setBuyerAddress("Jl. Raya Pondok Gede No. 12, Bekasi");
    setBuyerPhone("+62 812-3456-7890");
    setInvoiceNumber("#1234");
    setInvoiceDate("19 OKTOBER 2026");
    setDueDate("19 NOVEMBER 2026");
    setItems(DEFAULT_ITEMS);
  };

  const grandTotal = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  );

  // Keep minimum 8 rows in the table to match the classic template design
  const minTableRows = 8;
  const emptyRowsCount = Math.max(0, minTableRows - items.length);

  const handleDownloadJpg = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsExporting(true);
      setExportSuccess(false);

      const dataUrl = await toJpeg(invoiceRef.current, {
        quality: 0.98,
        pixelRatio: 3,
        backgroundColor: "#EAE2D3",
        cacheBust: true,
      });

      const sanitizedBuyer = (buyerName || "Customer")
        .trim()
        .replace(/[^a-zA-Z0-9-_]/g, "_");
      const sanitizedInv = (invoiceNumber || "INV")
        .trim()
        .replace(/[^a-zA-Z0-9-_]/g, "");

      const link = document.createElement("a");
      link.download = `Invoice-PS-SPORT-${sanitizedInv}-${sanitizedBuyer}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to generate JPG:", error);
      alert("Gagal mengunduh gambar JPG. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D1202F] flex items-center justify-center font-black text-white text-lg tracking-tighter shadow-lg shadow-[#D1202F]/25">
              PS
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                PS SPORT Invoice Generator
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  JPG Ready
                </span>
              </h1>
              <p className="text-xs text-stone-400">
                Isi data pembeli & daftar barang, lalu unduh invoice dalam format
                JPG
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Contoh
            </button>

            <button
              type="button"
              onClick={handleDownloadJpg}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#D1202F] hover:bg-[#b81b28] active:scale-[0.99] transition shadow-lg shadow-[#D1202F]/30 disabled:opacity-60 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Membuat JPG...
                </>
              ) : exportSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Berhasil Diunduh!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Invoice (.JPG)
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout: Left Editor & Right Live Invoice Preview */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        {/* LEFT PANEL: FORM INPUT */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 1: Data Pembeli (Bill To) */}
          <section className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-800">
              <User className="w-5 h-5 text-[#D1202F]" />
              <h2 className="font-bold text-base text-white">
                Data Pembeli (Bill To)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Nama Pembeli / Instansi
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Contoh: BUDI SANTOSO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-[#D1202F] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Alamat Pembeli
                </label>
                <textarea
                  rows={2}
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="Contoh: Jl. Raya Pondok Gede No. 12, Bekasi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-[#D1202F] transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  No. Telepon Pembeli
                </label>
                <input
                  type="text"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="Contoh: +62 812-3456-7890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-[#D1202F] transition"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Daftar Barang (Table Items) */}
          <section className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#D1202F]" />
                <h2 className="font-bold text-base text-white">
                  Daftar Barang & Harga
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D1202F]/15 text-[#ff4d5b] hover:bg-[#D1202F] hover:text-white border border-[#D1202F]/30 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Barang
              </button>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const subtotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/90 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-stone-400">
                        Barang #{idx + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-stone-300">
                          Subtotal:{" "}
                          <strong className="text-white">
                            {formatRupiah(subtotal)}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length <= 1}
                          title="Hapus barang"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-950/40 disabled:opacity-30 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-2.5">
                      <div className="col-span-12 sm:col-span-6">
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Nama / Deskripsi Barang
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Nama barang..."
                          className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Qty
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "qty",
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          className="w-full px-2.5 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                        />
                      </div>

                      <div className="col-span-8 sm:col-span-4">
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Harga Satuan (Rp)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "price",
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Grand Total
              </span>
              <span className="text-lg font-extrabold text-white font-mono">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </section>

          {/* Section 3: Detail Nomor Invoice & Tanggal */}
          <section className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-800">
              <FileText className="w-5 h-5 text-[#D1202F]" />
              <h2 className="font-bold text-base text-white">
                Detail Invoice & Pembayaran
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Nomor Invoice
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="#1234"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Tanggal (Date)
                </label>
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  placeholder="19 OKTOBER 2026"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                />
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Jatuh Tempo (Due Date)
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDueDate}
                    onChange={(e) => setShowDueDate(e.target.checked)}
                    className="accent-[#D1202F]"
                  />
                  Tampilkan
                </label>
              </div>
              {showDueDate && (
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="19 NOVEMBER 2026"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                />
              )}
            </div>

            {/* Payment Method Toggle & Inputs */}
            <div className="pt-3 border-t border-stone-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  <CreditCard className="w-4 h-4 text-[#D1202F]" />
                  Info Payment Method
                </span>
                <label className="inline-flex items-center gap-1.5 text-xs text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPaymentMethod}
                    onChange={(e) => setShowPaymentMethod(e.target.checked)}
                    className="accent-[#D1202F]"
                  />
                  Tampilkan
                </label>
              </div>

              {showPaymentMethod && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Nama Bank / Metode"
                    className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                  />
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Atas Nama"
                    className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                  />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="No. Rek / Kontak"
                    className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#D1202F]"
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT PANEL: LIVE INVOICE PREVIEW (EXACT MATCH TO IMAGE) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full overflow-x-auto pb-8 flex justify-center">
            {/* The Invoice Canvas to be exported as JPG */}
            <div
              ref={invoiceRef}
              style={{
                width: "794px",
                minHeight: "1123px",
                backgroundColor: "#EAE2D3",
                color: "#231F20",
              }}
              className="shrink-0 shadow-2xl px-16 py-14 flex flex-col justify-between select-none"
            >
              {/* TOP & MIDDLE CONTENT */}
              <div>
                {/* HEADER ROW: INVOICE & PS SPORT */}
                <div className="flex items-start justify-between gap-4">
                  <h1
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      color: "#D1202F",
                    }}
                    className="text-[76px] font-black leading-[0.88] tracking-[-0.03em] uppercase"
                  >
                    INVOICE
                  </h1>

                  <div
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      color: "#D1202F",
                    }}
                    className="text-right text-[40px] font-extrabold leading-[1.02] tracking-[-0.02em] uppercase pt-1"
                  >
                    <div>PS SPORT</div>
                  </div>
                </div>

                {/* SUB-HEADER ROW: INVOICE META & STATIC COMPANY ADDRESS */}
                <div
                  style={{
                    fontFamily: "var(--font-ibm-mono), monospace",
                  }}
                  className="mt-8 flex items-start justify-between text-[13.5px] leading-[1.6] tracking-[0.02em]"
                >
                  <div className="uppercase">
                    <div>INVOICE NUMBER: {invoiceNumber || "-"}</div>
                    <div>DATE: {invoiceDate || "-"}</div>
                    {showDueDate && dueDate && <div>DUE DATE: {dueDate}</div>}
                  </div>

                  <div className="text-right">
                    <div className="uppercase">Pondok gede, Kota Bekasi</div>
                    <div>+62 855-1090-808</div>
                  </div>
                </div>

                {/* BILL TO & PAYMENT METHOD ROW */}
                <div
                  style={{
                    fontFamily: "var(--font-ibm-mono), monospace",
                  }}
                  className="mt-9 flex items-start justify-between text-[13.5px] leading-[1.6]"
                >
                  <div className="max-w-[55%]">
                    <div className="font-bold text-[15.5px] mb-1.5 text-[#1A1718]">
                      Bill To:
                    </div>
                    <div className="uppercase font-medium break-words">
                      {buyerName || "-"}
                    </div>
                    <div className="whitespace-pre-line break-words">
                      {buyerAddress || "-"}
                    </div>
                    <div>{buyerPhone || "-"}</div>
                  </div>

                  {showPaymentMethod && (
                    <div className="text-right max-w-[42%]">
                      <div className="font-bold text-[15.5px] mb-1.5 text-[#1A1718]">
                        Payment Method
                      </div>
                      <div>{bankName}</div>
                      <div className="uppercase">{accountName}</div>
                      <div>{accountNumber}</div>
                    </div>
                  )}
                </div>

                {/* ITEMS TABLE */}
                <div
                  style={{
                    fontFamily: "var(--font-ibm-mono), monospace",
                    borderColor: "#231F20",
                  }}
                  className="mt-7 border-[1.5px]"
                >
                  <table className="w-full border-collapse table-fixed">
                    <thead>
                      <tr
                        style={{ borderBottom: "1.5px solid #231F20" }}
                        className="h-[44px] text-[13px] font-bold tracking-[0.08em] uppercase"
                      >
                        <th
                          style={{ borderRight: "1px solid #8C857B" }}
                          className="w-[44%] text-left px-5"
                        >
                          DESCRIPTION
                        </th>
                        <th
                          style={{ borderRight: "1px solid #8C857B" }}
                          className="w-[12%] text-center px-2"
                        >
                          QTY
                        </th>
                        <th
                          style={{ borderRight: "1px solid #8C857B" }}
                          className="w-[22%] text-right px-4"
                        >
                          PRICE
                        </th>
                        <th className="w-[22%] text-right px-4">SUBTOTAL</th>
                      </tr>
                    </thead>

                    <tbody className="text-[13px]">
                      {items.map((item) => {
                        const subtotal =
                          (Number(item.qty) || 0) * (Number(item.price) || 0);
                        return (
                          <tr
                            key={item.id}
                            style={{ borderBottom: "1px solid #8C857B" }}
                            className="h-[44px]"
                          >
                            <td
                              style={{ borderRight: "1px solid #8C857B" }}
                              className="px-5 uppercase truncate"
                            >
                              {item.description}
                            </td>
                            <td
                              style={{ borderRight: "1px solid #8C857B" }}
                              className="px-2 text-center"
                            >
                              {item.description || item.price > 0
                                ? formatQty(item.qty)
                                : ""}
                            </td>
                            <td
                              style={{ borderRight: "1px solid #8C857B" }}
                              className="px-4 text-right whitespace-nowrap"
                            >
                              {item.description || item.price > 0
                                ? formatRupiah(item.price)
                                : ""}
                            </td>
                            <td className="px-4 text-right whitespace-nowrap">
                              {item.description || item.price > 0
                                ? formatRupiah(subtotal)
                                : ""}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Empty filler rows to keep the classic 8-row invoice height */}
                      {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                        <tr
                          key={`empty-${idx}`}
                          style={{ borderBottom: "1px solid #8C857B" }}
                          className="h-[44px]"
                        >
                          <td
                            style={{ borderRight: "1px solid #8C857B" }}
                            className="px-5"
                          />
                          <td
                            style={{ borderRight: "1px solid #8C857B" }}
                            className="px-2"
                          />
                          <td
                            style={{ borderRight: "1px solid #8C857B" }}
                            className="px-4"
                          />
                          <td className="px-4" />
                        </tr>
                      ))}
                    </tbody>

                    {/* GRAND TOTAL FOOTER (NO TAX) */}
                    <tfoot>
                      <tr
                        style={{ borderTop: "1.5px solid #231F20" }}
                        className="h-[48px] text-[13.5px] font-bold"
                      >
                        <td
                          colSpan={3}
                          style={{ borderRight: "1px solid #8C857B" }}
                          className="text-right pr-6 tracking-[0.08em] uppercase"
                        >
                          GRAND TOTAL
                        </td>
                        <td className="px-4 text-right whitespace-nowrap text-[14px]">
                          {formatRupiah(grandTotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* BOTTOM FOOTER: TERM & CONDITION + CONTACT (NO SIGNATURE) */}
              <div className="mt-10 pt-2 flex items-start justify-between gap-10">
                {/* Left: TERM & CONDITION */}
                <div className="flex-1">
                  <h3
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                    }}
                    className="text-[13.5px] font-bold tracking-[0.03em] uppercase mb-2 text-[#231F20]"
                  >
                    TERM &amp; CONDITION
                  </h3>
                  <div
                    style={{
                      fontFamily: "var(--font-ibm-mono), monospace",
                    }}
                    className="text-[10.2px] leading-[1.55] text-justify space-y-1 text-[#231F20]"
                  >
                    <p>
                      Mohon periksa kondisi paket saat diterima. Jika produk
                      tidak sesuai pesanan, terdapat kekurangan jumlah, atau
                      diduga cacat produk, segera hubungi penjual dengan
                      menyertakan foto/video dan bukti transaksi.
                    </p>
                    <p>
                      Pengajuan komplain dilakukan sesegera mungkin setelah
                      barang diterima agar pemeriksaan dapat dilakukan. Retur,
                      penukaran, atau pengembalian dana akan ditangani
                      berdasarkan hasil pemeriksaan, kesepakatan transaksi, dan
                      ketentuan yang berlaku. Hak konsumen sesuai peraturan yang
                      berlaku tetap diperhatikan.
                    </p>
                  </div>
                </div>

                {/* Right: FOR ANY QUESTIONS, PLEASE CONTACT */}
                <div
                  style={{
                    fontFamily: "var(--font-ibm-mono), monospace",
                  }}
                  className="w-[210px] shrink-0 pt-0.5"
                >
                  <div
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                    }}
                    className="text-[11px] font-bold leading-[1.45] tracking-[0.02em] uppercase text-[#231F20]"
                  >
                    FOR ANY QUESTIONS, PLEASE CONTACT
                  </div>
                  <div className="text-[12px] font-semibold mt-1 text-[#231F20]">
                    +62 855-1090-808
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
