import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddEntryModal } from "@/components/timesheets/AddEntryModal";

describe("AddEntryModal", () => {
  it("blocks submit when required fields are missing and surfaces errors", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <AddEntryModal
        open
        onClose={() => {}}
        defaultDate="2024-01-22"
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: /add entry/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText(/select a project/i)).toBeInTheDocument();
    expect(screen.getByText(/select a type of work/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
  });

  it("submits parsed values on a valid form", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <AddEntryModal
        open
        onClose={() => {}}
        defaultDate="2024-01-22"
        onSubmit={onSubmit}
      />
    );

    await user.selectOptions(screen.getByLabelText(/select project/i), "Mobile App");
    await user.selectOptions(screen.getByLabelText(/type of work/i), "Feature");
    await user.type(
      screen.getByLabelText(/task description/i),
      "Build login screen"
    );
    await user.click(screen.getByRole("button", { name: /increase hours/i }));
    await user.click(screen.getByRole("button", { name: /add entry/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        project: "Mobile App",
        typeOfWork: "Feature",
        description: "Build login screen",
        hours: 2,
        date: "2024-01-22",
      })
    );
  });
});
