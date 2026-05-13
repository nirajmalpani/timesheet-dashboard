import {
  WEEK_TARGET_HOURS,
  actionLabelForStatus,
  deriveStatus,
  eachDayInRange,
  formatWeekRange,
  sumHours,
} from "@/lib/week-utils";

describe("deriveStatus", () => {
  it("returns missing when no hours have been logged", () => {
    expect(deriveStatus(0)).toBe("missing");
    expect(deriveStatus(-1)).toBe("missing");
  });
  it("returns incomplete when hours are below the weekly target", () => {
    expect(deriveStatus(1)).toBe("incomplete");
    expect(deriveStatus(WEEK_TARGET_HOURS - 1)).toBe("incomplete");
  });
  it("returns completed when hours meet or exceed the weekly target", () => {
    expect(deriveStatus(WEEK_TARGET_HOURS)).toBe("completed");
    expect(deriveStatus(WEEK_TARGET_HOURS + 5)).toBe("completed");
  });
});

describe("sumHours", () => {
  it("sums hours across entries", () => {
    expect(
      sumHours([
        { id: "1", timesheetId: "w", date: "2024-01-01", project: "Mobile App", typeOfWork: "Feature", description: "x", hours: 4 },
        { id: "2", timesheetId: "w", date: "2024-01-02", project: "Mobile App", typeOfWork: "Feature", description: "x", hours: 6 },
      ])
    ).toBe(10);
  });
});

describe("formatWeekRange", () => {
  it("formats a range within the same month", () => {
    expect(formatWeekRange("2024-01-22", "2024-01-26")).toBe("22 - 26 January, 2024");
  });
  it("formats a range that crosses months", () => {
    expect(formatWeekRange("2024-01-29", "2024-02-02")).toBe(
      "29 January - 2 February, 2024"
    );
  });
});

describe("eachDayInRange", () => {
  it("returns inclusive list of ISO dates", () => {
    expect(eachDayInRange("2024-01-22", "2024-01-26")).toEqual([
      "2024-01-22",
      "2024-01-23",
      "2024-01-24",
      "2024-01-25",
      "2024-01-26",
    ]);
  });
});

describe("actionLabelForStatus", () => {
  it("maps each status to the right action label", () => {
    expect(actionLabelForStatus("completed")).toBe("View");
    expect(actionLabelForStatus("incomplete")).toBe("Update");
    expect(actionLabelForStatus("missing")).toBe("Create");
  });
});
