export const projects = [
  {
    id: 1,
    name: "CRM Migration",
    sponsor: "Marketing",
    dueDate: "Sep 2026",
    status: "On Track",

    bac: 2100000,
    evm: [
      {
        date: "2026-08-01",
        plannedValue: 500000,
        earnedValue: 450000,
        actualCost: 480000,
      },
      {
        date: "2026-08-15",
        plannedValue: 750000,
        earnedValue: 680000,
        actualCost: 720000,
      },
    ],
  },

  {
    id: 2,
    name: "Cloud Platform",
    sponsor: "IT",
    dueDate: "Dec 2026",
    status: "At Risk",

    bac: 8400000,
    evm: [
      {
        date: "2026-08-01",
        plannedValue: 1200000,
        earnedValue: 1050000,
        actualCost: 1150000,
      },
      {
        date: "2026-08-15",
        plannedValue: 1800000,
        earnedValue: 1450000,
        actualCost: 1750000,
      },
    ],
  },

  {
    id: 3,
    name: "Data Warehouse",
    sponsor: "Finance",
    dueDate: "Aug 2026",
    status: "Delayed",

    bac: 3700000,
    evm: [
      {
        date: "2026-08-01",
        plannedValue: 2800000,
        earnedValue: 2500000,
        actualCost: 2700000,
      },
      {
        date: "2026-08-15",
        plannedValue: 3200000,
        earnedValue: 2750000,
        actualCost: 3150000,
      },
    ],
  },
];