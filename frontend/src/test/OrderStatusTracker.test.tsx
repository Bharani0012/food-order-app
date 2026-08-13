import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderStatusTracker from "../components/OrderStatusTracker";

describe("OrderStatusTracker", () => {
  it("marks earlier steps done and the current step active", () => {
    render(<OrderStatusTracker status="PREPARING" />);

    expect(screen.getByText("Order Received").closest("li")?.textContent).toContain("✓");
    expect(screen.getByText("Preparing").closest("li")?.textContent).toContain("In progress");
    expect(screen.getByText("Out for Delivery").closest("li")?.textContent).not.toContain("In progress");
    expect(screen.getByText("Out for Delivery").closest("li")?.textContent).not.toContain("✓");
    expect(screen.getByText("Delivered").closest("li")?.textContent).not.toContain("In progress");
    expect(screen.getByText("Delivered").closest("li")?.textContent).not.toContain("✓");
  });
});
