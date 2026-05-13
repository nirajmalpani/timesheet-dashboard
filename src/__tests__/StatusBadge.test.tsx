import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/ui/StatusBadge";

describe("StatusBadge", () => {
  it("renders the right label for each status", () => {
    const { rerender } = render(<StatusBadge status="completed" />);
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();

    rerender(<StatusBadge status="incomplete" />);
    expect(screen.getByText("INCOMPLETE")).toBeInTheDocument();

    rerender(<StatusBadge status="missing" />);
    expect(screen.getByText("MISSING")).toBeInTheDocument();
  });

  it("exposes status via accessible name", () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByLabelText(/Status: COMPLETED/)).toBeInTheDocument();
  });
});
