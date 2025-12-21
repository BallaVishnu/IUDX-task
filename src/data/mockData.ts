export type ConnectionStatus = "Established" | "Revoked";

export type Connection = {
  id: string;
  name: string;
  status: ConnectionStatus;
  host: {
    name: string;
    locker: string;
  };
  guest: {
    name: string;
    locker: string;
  };
};

export type Resource = {
  id: string;
  name: string;
  description?: string;
};

export type ObligationStatus = "Pending" | "Approved" | "Rejected";

export type Obligation = {
  id: string;
  name: string;
  purpose: string;
  transactionType: "share";
  dataElement?: string;
  status: ObligationStatus;
  consentArtefact: {
    purpose: string;
    duration: string;
    conditions: string[];
    ownerLocker: string;
    receiverLocker: string;
  };
};

export const CONNECTIONS: Connection[] = [
  {
    id: "conn-1",
    name: "Felicitation between Kaveri and LIC Insurance",
    status: "Established",
    host: {
      name: "LIC Insurance",
      locker: "LIC Locker A"
    },
    guest: {
      name: "Kaveri Hospital",
      locker: "Kaveri Locker B"
    }
  },
  {
    id: "conn-guest-1",
    name: "Discharge Summary Sharing with City Hospital",
    status: "Established",
    host: {
      name: "City Hospital",
      locker: "City Locker D"
    },
    guest: {
      name: "Kaveri Hospital",
      locker: "Kaveri Locker B"
    }
  },
  {
    id: "conn-guest-2",
    name: "Lab Collaboration with Apex Diagnostics",
    status: "Established",
    host: {
      name: "Apex Diagnostics",
      locker: "Apex Locker C"
    },
    guest: {
      name: "Kaveri Hospital",
      locker: "Kaveri Locker B"
    }
  },
  {
    id: "conn-2",
    name: "Wellness Data Sharing with Apex Labs",
    status: "Established",
    host: {
      name: "LIC Insurance",
      locker: "LIC Locker A"
    },
    guest: {
      name: "Apex Diagnostics",
      locker: "Apex Locker C"
    }
  },
  {
    id: "conn-3",
    name: "Specialist Referral to City Hospital",
    status: "Established",
    host: {
      name: "LIC Insurance",
      locker: "LIC Locker A"
    },
    guest: {
      name: "City Hospital",
      locker: "City Locker D"
    }
  }
];

export const RESOURCES: Resource[] = [
  { id: "res-1", name: "Insurance Claim Receipt", description: "Claim submission acknowledgement" },
  { id: "res-2", name: "Chest X-Ray Report", description: "Recent imaging report" },
  { id: "res-3", name: "CBC Blood Test Report", description: "Complete blood count lab result" },
  { id: "res-4", name: "Treatment Summary", description: "Discharge or treatment summary" }
];

export const INITIAL_OBLIGATIONS_BY_CONNECTION: Record<string, Obligation[]> = {
  "conn-1": [
    {
      id: "obl-1",
      name: "Insurance Claim Receipt",
      purpose: "Process and validate insurance claim for hospitalization",
      transactionType: "share",
      dataElement: "",
      status: "Pending",
      consentArtefact: {
        purpose: "Insurance claim verification",
        duration: "Valid for 90 days from approval",
        conditions: [
          "Data is reference only; no direct transfer",
          "Revocable by either party at any time",
          "Usage strictly for claim processing"
        ],
        ownerLocker: "LIC Locker A",
        receiverLocker: "Kaveri Locker B"
      }
    },
    {
      id: "obl-2",
      name: "Treatment Summary",
      purpose: "Provide discharge summary for follow-up care",
      transactionType: "share",
      dataElement: "",
      status: "Pending",
      consentArtefact: {
        purpose: "Post-hospitalization coordination",
        duration: "Valid for 60 days from approval",
        conditions: [
          "Use strictly for continuity of care",
          "No secondary sharing without consent",
          "Revocable by either party at any time"
        ],
        ownerLocker: "LIC Locker A",
        receiverLocker: "Kaveri Locker B"
      }
    }
  ],
  "conn-2": [
    {
      id: "obl-3",
      name: "CBC Blood Test Report",
      purpose: "Routine wellness screening reference",
      transactionType: "share",
      dataElement: "",
      status: "Pending",
      consentArtefact: {
        purpose: "Wellness screening verification",
        duration: "Valid for 30 days from approval",
        conditions: [
          "Read-only reference",
          "Revocable anytime",
          "No research use"
        ],
        ownerLocker: "LIC Locker A",
        receiverLocker: "Apex Locker C"
      }
    }
  ],
  "conn-3": [
    {
      id: "obl-4",
      name: "Chest X-Ray Report",
      purpose: "Specialist review for referral",
      transactionType: "share",
      dataElement: "",
      status: "Pending",
      consentArtefact: {
        purpose: "Second opinion for pulmonary referral",
        duration: "Valid for 45 days from approval",
        conditions: [
          "Use only for referral decision",
          "Do not redistribute",
          "Revocable by either party at any time"
        ],
        ownerLocker: "LIC Locker A",
        receiverLocker: "City Locker D"
      }
    }
  ]
};

