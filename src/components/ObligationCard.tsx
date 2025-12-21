import React, { useState } from "react";
import { View } from "react-native";
import { Button, Card, Paragraph, SegmentedButtons, Text } from "react-native-paper";
import { Obligation, ObligationStatus } from "../data/mockData";
import StatusBadge from "./StatusBadge";

type Props = {
  obligation: Obligation;
  canSelectResource?: boolean;
  canDecide?: boolean;
  canEdit?: boolean;
  disabledActions?: boolean;
  onSelectResource?: () => void;
  onDecision?: (decision: ObligationStatus) => void;
  onViewArtefact?: () => void;
  onEdit?: () => void;
  roleLabel: string;
};

const ObligationCard: React.FC<Props> = ({
  obligation,
  canSelectResource,
  canDecide,
  canEdit,
  disabledActions,
  onSelectResource,
  onDecision,
  onViewArtefact,
  onEdit,
  roleLabel
}) => {
  const [draftDecision, setDraftDecision] = useState<ObligationStatus | undefined>();

  const handleSaveDecision = () => {
    if (draftDecision && onDecision) {
      onDecision(draftDecision);
    }
  };

  return (
    <Card style={{ marginVertical: 8 }}>
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap"
          }}
        >
          <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
            <Text variant="titleMedium">{obligation.name}</Text>
            <Paragraph>{roleLabel}</Paragraph>
          </View>
          <View style={{ marginTop: 4 }}>
            <StatusBadge status={obligation.status} />
          </View>
        </View>
        <Paragraph>Purpose: {obligation.purpose}</Paragraph>
        <Paragraph>Transaction: {obligation.transactionType}</Paragraph>
        <Paragraph>Selected resource: {obligation.dataElement || "Not selected"}</Paragraph>
        <View style={{ marginTop: 12 }}>
          <Button
            mode="outlined"
            onPress={onViewArtefact}
            style={{ marginBottom: 8, borderRadius: 10 }}
            contentStyle={{ justifyContent: "center" }}
            disabled={disabledActions}
          >
            View Consent Artefact
          </Button>
          {canSelectResource && (
            <Button
              mode="contained"
              onPress={onSelectResource}
              style={{ marginBottom: 8, borderRadius: 10 }}
              contentStyle={{ justifyContent: "center" }}
              disabled={disabledActions}
            >
              Select Resource
            </Button>
          )}
          {canEdit && (
            <Button
              mode="text"
              onPress={onEdit}
              style={{ marginBottom: 4, alignSelf: "flex-start" }}
              textColor="#1565c0"
              disabled={disabledActions}
            >
              Edit Artefact
            </Button>
          )}
        </View>

        {canDecide && (
          <View style={{ marginTop: 16 }}>
            <Text variant="titleSmall" style={{ marginBottom: 4 }}>
              Opposite user review
            </Text>
            <SegmentedButtons
              value={draftDecision}
              onValueChange={(value) => setDraftDecision(value as ObligationStatus)}
              buttons={[
                { label: "Approve", value: "Approved" },
                { label: "Reject", value: "Rejected" }
              ]}
              disabled={disabledActions}
            />
            <Button
              mode="contained"
              style={{ marginTop: 8 }}
              onPress={handleSaveDecision}
              disabled={!draftDecision || draftDecision === obligation.status}
            >
              Save decision
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default ObligationCard;

