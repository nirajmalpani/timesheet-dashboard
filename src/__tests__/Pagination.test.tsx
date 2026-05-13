import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/ui/Pagination";

describe("Pagination", () => {
  it("disables Previous on the first page", () => {
    render(
      <Pagination page={1} pageSize={5} total={20} onPageChange={() => {}} />
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();
  });

  it("calls onPageChange when a numbered page is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <Pagination page={1} pageSize={5} total={20} onPageChange={onPageChange} />
    );
    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables Next on the last page", () => {
    render(
      <Pagination page={4} pageSize={5} total={20} onPageChange={() => {}} />
    );
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
