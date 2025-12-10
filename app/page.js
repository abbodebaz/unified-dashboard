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
      className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white"
    >
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg mb-8">
        🔍 منصة <span className="text-yellow-300">فَزْعَة</span> للبحث الموحّد
      </h1>

      {/* Search Box */}
      <div className="max-w-xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl">
        <input
          type="text"
          placeholder="أدخل رقم الطلب أو رقم الجوال…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="w-full bg-white text-gray-900 border-0 p-4 rounded-lg text-lg
                     focus:ring-4 focus:ring-yellow-300 outline-none"
        />

        <button
          onClick={search}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold p-3 rounded-lg text-lg mt-4 transition shadow-md"
        >
          بحث
        </button>
      </div>

      {error && (
        <p className="text-red-300 text-center mt-4 text-lg">{error}</p>
      )}

      {/* Loading */}
      {loading && <Skeleton />}

      {/* Results */}
      {!loading && results && (
        <div className="max-w-6xl mx-auto mt-10 space-y-10">

          {/* ======================
                SUMMARY CARDS
          ====================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            {/* OneStation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg text-center"
            >
              <h3 className="text-xl font-bold text-yellow-300 mb-2">طلبات OneStation</h3>
              <p className="text-4xl font-extrabold text-white">
                {results.onestation.length}
              </p>
            </motion.div>

            {/* AHD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg text-center"
            >
              <h3 className="text-xl font-bold text-emerald-300 mb-2">طلبات AHD</h3>
              <p className="text-4xl font-extrabold text-white">
                {results.ahd.length}
              </p>
            </motion.div>

            {/* Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg text-center"
            >
              <h3 className="text-xl font-bold text-purple-300 mb-2">تذاكر Tickets</h3>
              <p className="text-4xl font-extrabold text-white">
                {results.tickets.length}
              </p>
            </motion.div>

          </div>

          {/* ======================
                RESULTS SECTIONS
          ====================== */}
          <ResultSection
            title="طلبات OneStation"
            color="yellow"
            icon="📦"
            items={results.onestation}
          />

          <ResultSection
            title="طلبات AHD"
            color="emerald"
            icon="🛠️"
            items={results.ahd}
          />

          <ResultSection
            title="تذاكر Tickets"
            color="purple"
            icon="🎫"
            items={results.tickets}
          />
        </div>
      )}
    </div>
  );
}

/* ===========================================================
      SECTION WITH FILTER + PAGINATION + ANIMATION
   =========================================================== */
function ResultSection({ title, color, icon, items }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  const pageSize = 6;

  // فلترة داخل النتائج
  const filteredItems = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // إذا تغير الفلتر → ارجع للصفحة الأولى
  useEffect(() => setPage(1), [filter]);

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">

      {/* Section Title */}
      <h2 className={`text-3xl font-bold flex gap-2 items-center mb-6 text-${color}-300`}>
        {icon} {title}
      </h2>

      {/* Search Filter Bar */}
      <input
        type="text"
        placeholder="بحث داخل النتائج…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 p-3 rounded-lg mb-6 focus:ring-2 focus:ring-white outline-none"
      />

      {/* No Results */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-200 text-lg">لا توجد نتائج مطابقة.</p>
      ) : (
        <>
          {/* Cards + Animation */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {paginatedItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <ResultCard item={item} color={color} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination (Numbered) */}
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition border 
                ${
                  page === num
                    ? "bg-white text-gray-900 border-white"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ===========================================================
                          CARD COMPONENT
   =========================================================== */
function ResultCard({ item, color }) {
  return (
    <div
      className={`
        bg-white/20 border border-${color}-300/40 
        rounded-xl p-5 shadow-md backdrop-blur-lg text-white
      `}
    >
      {Object.entries(item).map(([key, value]) => (
        <p key={key} className="mb-2 text-lg leading-relaxed">
          <span className={`font-bold text-${color}-200`}>
            {key.replace(/_/g, " ")}:
          </span>{" "}
          {String(value)}
        </p>
      ))}
    </div>
  );
}

/* ===========================================================
                          SKELETON LOADER
   =========================================================== */
function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl"
        >
          <div className="h-6 bg-white/30 rounded w-48 mb-6"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="h-24 bg-white/20 rounded-xl"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
