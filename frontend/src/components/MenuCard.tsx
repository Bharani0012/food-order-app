import type { MenuItem } from "../types";
import { useCart } from "../context/CartContext";

export default function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
        <img
          src={item.image_url ?? undefined}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-neutral-900">{item.name}</h3>
        <p className="text-neutral-500 text-sm mt-1 flex-1">{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-lg text-neutral-900">₹{item.price}</span>
          <button
            onClick={() => addItem(item)}
            className="inline-flex items-center gap-1 bg-orange-600 text-white text-sm font-semibold px-3.5 py-2 rounded-full hover:bg-orange-700 active:scale-95 transition"
          >
            <span className="text-base leading-none">+</span> Add
          </button>
        </div>
      </div>
    </div>
  );
}
