export const getRecruitState = () => {
  const now = new Date();

  const ranges = [
    {
      state: "APPLY",
      start: new Date("2026-02-16T00:00:00"),
      end: new Date("2026-03-03T21:59:59"),
    },
    {
      state: "DOCUMENT",
      start: new Date("2026-03-03T22:00:00"),
      end: new Date("2026-03-04T09:59:59"),
    },
    {
      state: "FIRST_PASSED",
      start: new Date("2026-03-04T10:00:00"),
      end: new Date("2026-03-05T23:59:59"),
    },
    {
      state: "INTERVIEW",
      start: new Date("2026-03-06T00:00:00"),
      end: new Date("2026-03-09T09:59:59"),
    },
    {
      state: "FINAL_PASSED",
      start: new Date("2026-03-09T10:00:00"),
      end: new Date("2026-03-12T23:59:59"),
    },
  ];

  for (const range of ranges) {
    if (now >= range.start && now <= range.end) {
      return range.state;
    }
  }

  return "CLOSED";
};


