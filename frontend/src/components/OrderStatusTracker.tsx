import type { OrderStatus } from "../types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "RECEIVED", label: "Order Received" },
  { key: "PREPARING", label: "Preparing" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <ul>
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 ${
                  isDone
                    ? "bg-green-600 text-white"
                    : isCurrent
                      ? "bg-orange-600 text-white animate-pulse"
                      : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 my-1 ${isDone ? "bg-green-600" : "bg-neutral-200"}`}
                />
              )}
            </div>
            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
              <p
                className={`font-medium ${
                  isDone || isCurrent ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && <p className="text-sm text-orange-600">In progress...</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
