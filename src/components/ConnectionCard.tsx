import React from "react";
import { Card, Paragraph, Title } from "react-native-paper";
import { Connection } from "../data/mockData";
import StatusBadge from "./StatusBadge";

type Props = {
  connection: Connection;
  onPress: () => void;
};

const ConnectionCard: React.FC<Props> = ({ connection, onPress }) => {
  return (
    <Card onPress={onPress} style={{ marginVertical: 8 }}>
      <Card.Content>
        <Title>{connection.name}</Title>
        <Paragraph>
          Host: {connection.host.name} {"\n"}
          Guest: {connection.guest.name}
        </Paragraph>
        <StatusBadge status={connection.status} />
      </Card.Content>
    </Card>
  );
};

export default ConnectionCard;

