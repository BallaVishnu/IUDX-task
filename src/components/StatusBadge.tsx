import React from "react";
import { Chip } from "react-native-paper";
import { ConnectionStatus, ObligationStatus } from "../data/mockData";

type Props = {
  status: ConnectionStatus | ObligationStatus;
};

const colorMap: Record<string, string> = {
  Established: "#2e7d32",
  Revoked: "#d32f2f",
  Pending: "#ef6c00",
  Approved: "#2e7d32",
  Rejected: "#c62828"
};

const StatusBadge: React.FC<Props> = ({ status }) => {
  const backgroundColor = colorMap[status] ?? "#546e7a";
  return (
    <Chip
      compact
      style={{ backgroundColor, marginLeft: 8 }}
      textStyle={{ color: "#fff", fontWeight: "600" }}
    >
      {status}
    </Chip>
  );
};

export default StatusBadge;

