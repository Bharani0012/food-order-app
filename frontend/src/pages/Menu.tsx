import { useEffect, useState } from "react";
import { getMenuItems } from "../services/menuService";
import type { MenuItem } from "../types";
import MenuCard from "../components/MenuCard";

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenuItems()
      .then(setItems)
      .catch(() => setError("Could not load menu"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Today's Menu</h1>
        <p className="text-neutral-500 mt-1">Fresh picks, delivered hot.</p>
      </div>

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
              <div className="aspect-[4/3] bg-neutral-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-neutral-100 rounded animate-pulse w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
