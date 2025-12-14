"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(
        `https://web-production-e9360.up.railway.app/unified/${query}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setResults(data.sources);
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 text-white font-[Tajawal]"
    >
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold">
          🔍 منصة <span className="text-yellow-300">فَزْعَة</span>
        </h1>
        <p className="text-white/80 text-xl mt-3">
          محرك البحث الموحّد للطلبات والتذاكر
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-2xl">
        <input
          type="text"
          placeholder="أدخل رقم الطلب أو رقم الجوال…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="w-full bg-white text-gray-900 p-4 rounded-xl text-lg outline-none"
        />

        <button
          onClick={search}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold p-3 rounded-xl text-lg mt-4"
        >
          بحث
        </button>
      </div>

      {error && <p className="text-red-300 text-center mt-4">{error}</p>}
      {loading && <Skeleton />}

      {!loading && results && (
        <div className="max-w-7xl mx-auto mt-10 space-y-10">
          <SummaryCards results={results} />

          <ResultSection
            title="طلبات OneStation"
            color="yellow"
            items={results.onestation}
          />

          <ResultSection
            title="طلبات AHD"
            color="emerald"
            items={results.ahd}
          />

          <ResultSection
            title="تذاكر Tickets"
            color="purple"
            items={results.tickets}
          />
        </div>
      )}
    </div>
  );
}

/* ===================== SUMMARY ===================== */
function SummaryCards({ results }) {
  const cards = [
    { title: "OneStation", count: results.onestation.length, color: "yellow" },
    { title: "AHD", count: results.ahd.length, color: "emerald" },
    { title: "Tickets", count: results.tickets.length, color: "purple" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/20 p-6 rounded-2xl text-center"
        >
          <p className="text-xl font-bold">{c.title}</p>
          <p className="text-5xl font-extrabold mt-2">{c.count}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ===================== SECTION ===================== */
function ResultSection({ title, color, items }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const pageSize = 6;

  const filtered = items.filter((i) =>
    JSON.stringify(i).toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [filter]);

  return (
    <div className="bg-white/10 border border-white/20 p-6 rounded-2xl">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>

      <input
        type="text"
        placeholder="بحث داخل النتائج…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full bg-white/20 p-3 rounded-lg mb-6 outline-none"
      />

      {filtered.length === 0 ? (
        <p>لا توجد نتائج</p>
      ) : (
        <>
          <ResultTable items={paginated} color={color} />

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-4 py-2 rounded ${
                  page === n
                    ? "bg-white text-gray-900"
                    : "bg-white/20"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== TABLE ===================== */
function ResultTable({ items }) {
  if (!items || items.length === 0) return null;

  const COLUMN_LABELS = {
    status: "الحالة",
    notes: "ملاحظات",
    company: "الشركة / الفرع",
    appointment_type: "نوع الموعد",
    location: "المدينة",
    delivery_date: "تاريخ التوصيل",
    phone_number: "رقم الجوال",
    customer_name: "اسم العميل",
    sales_order: "أمر البيع",
    booking_date: "تاريخ الحجز",
    id: "رقم الطلب"
  };

  const columns = Object.keys(COLUMN_LABELS);

  return (
    <div className="overflow-x-auto rounded-xl border border-white/20">
      <table className="min-w-full text-right text-white">
        <thead className="bg-white/20">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-sm font-bold whitespace-nowrap"
              >
                {COLUMN_LABELS[col]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="odd:bg-white/5 even:bg-white/10 hover:bg-white/20"
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-3 text-sm whitespace-nowrap"
                  >
                    {item[col] ?? "-"}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}


/* ===================== SKELETON ===================== */
function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto mt-10 animate-pulse space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/10 border border-white/20 p-6 rounded-2xl"
        >
          <div className="h-6 bg-white/30 rounded w-48 mb-4"></div>
          <div className="h-32 bg-white/20 rounded"></div>
        </div>
      ))}
    </div>
  );
}
