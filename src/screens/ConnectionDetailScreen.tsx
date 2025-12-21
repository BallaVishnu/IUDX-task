import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  List,
  Modal,
  Portal,
  RadioButton,
  Text,
  TextInput,
  useTheme
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  CONNECTIONS,
  INITIAL_OBLIGATIONS_BY_CONNECTION,
  RESOURCES,
  Obligation,
  ObligationStatus
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import ResourceSelector from "../components/ResourceSelector";
import ObligationCard from "../components/ObligationCard";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "ConnectionDetail">;

const ConnectionDetailScreen: React.FC<Props> = ({ route }) => {
  const { connectionId } = route.params;
  const theme = useTheme();
  const { role } = useAuth();
  const connection = useMemo(
    () => CONNECTIONS.find((c) => c.id === connectionId) ?? CONNECTIONS[0],
    [connectionId]
  );
  const storageKey = `obligations-${connection.id}`;
  const statusKey = `connection-status-${connection.id}`;

  const [obligations, setObligations] = useState<Obligation[]>(
    INITIAL_OBLIGATIONS_BY_CONNECTION[connection.id] ?? []
  );
  const [connectionStatus, setConnectionStatus] = useState(connection.status);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedObligationId, setSelectedObligationId] = useState<string | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>();
  const [artefactToView, setArtefactToView] = useState<Obligation | null>(null);
  const [editingObligation, setEditingObligation] = useState<Obligation | null>(null);
  const [editPurpose, setEditPurpose] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editConditions, setEditConditions] = useState("");
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [activeObligationId, setActiveObligationId] = useState<string | null>(
    (INITIAL_OBLIGATIONS_BY_CONNECTION[connection.id] ?? [])[0]?.id ?? null
  );

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setObligations(JSON.parse(stored));
      }
      const storedStatus = await AsyncStorage.getItem(statusKey);
      if (storedStatus) {
        setConnectionStatus(storedStatus as typeof connection.status);
      }
      if (!activeObligationId) {
        const initialId = (INITIAL_OBLIGATIONS_BY_CONNECTION[connection.id] ?? [])[0]?.id ?? null;
        setActiveObligationId(initialId);
      }
    };
    load();
  }, [storageKey, statusKey, connection.id, activeObligationId]);

  useEffect(() => {
    if (!activeObligationId && obligations[0]) {
      setActiveObligationId(obligations[0].id);
    }
    if (activeObligationId && !obligations.find((o) => o.id === activeObligationId) && obligations[0]) {
      setActiveObligationId(obligations[0].id);
    }
  }, [activeObligationId, obligations]);

  const persistObligations = async (next: Obligation[]) => {
    setObligations(next);
    await AsyncStorage.setItem(storageKey, JSON.stringify(next));
  };

  const persistStatus = async (nextStatus: typeof connection.status) => {
    setConnectionStatus(nextStatus);
    await AsyncStorage.setItem(statusKey, nextStatus);
  };

  const openResourceSelector = (obligationId: string) => {
    setSelectedObligationId(obligationId);
    const existing = obligations.find((o) => o.id === obligationId);
    if (existing?.dataElement) {
      const prefill = RESOURCES.find((r) => r.name === existing.dataElement)?.id;
      setSelectedResourceId(prefill);
    } else {
      setSelectedResourceId(undefined);
    }
    setResourceModalOpen(true);
  };

  const handleResourceSubmit = async () => {
    if (!selectedObligationId || !selectedResourceId) {
      setResourceModalOpen(false);
      return;
    }
    const resource = RESOURCES.find((r) => r.id === selectedResourceId);
    const next = obligations.map((o) =>
      o.id === selectedObligationId ? { ...o, dataElement: resource?.name, status: "Pending" } : o
    );
    await persistObligations(next);
    setResourceModalOpen(false);
  };

  const handleDecision = async (obligationId: string, decision: ObligationStatus) => {
    const next = obligations.map((o) => (o.id === obligationId ? { ...o, status: decision } : o));
    await persistObligations(next);
  };

  const handleEdit = (obligation: Obligation) => {
    setEditingObligation(obligation);
    setEditPurpose(obligation.consentArtefact.purpose);
    setEditDuration(obligation.consentArtefact.duration);
    setEditConditions(obligation.consentArtefact.conditions.join("\n"));
  };

  const saveEdit = async () => {
    if (!editingObligation) return;
    const updated = obligations.map((o) =>
      o.id === editingObligation.id
        ? {
            ...o,
            purpose: editPurpose,
            consentArtefact: {
              ...o.consentArtefact,
              purpose: editPurpose,
              duration: editDuration,
              conditions: editConditions
                .split("\n")
                .map((c) => c.trim())
                .filter(Boolean)
            }
          }
        : o
    );
    await persistObligations(updated);
    setEditingObligation(null);
  };

  const revokeConnection = async () => {
    await persistStatus("Revoked");
  };
  const establishConnection = async () => {
    await persistStatus("Established");
  };

  const isHost = role === "HOST";
  const isRevoked = connectionStatus === "Revoked";
  const activeObligation = obligations.find((o) => o.id === activeObligationId) ?? obligations[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 28 }}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text variant="titleLarge">{connection.name}</Text>
            <StatusBadge status={connectionStatus} />
          </View>
          <Text variant="bodyMedium" style={{ marginTop: 4 }}>
            Host: {connection.host.name} ({connection.host.locker})
          </Text>
          <Text variant="bodyMedium">
            Guest: {connection.guest.name} ({connection.guest.locker})
          </Text>
          {isHost && obligations[0] && !isRevoked && (
            <Button
              mode="contained"
              style={{ marginTop: 12, marginBottom: 6, borderRadius: 12 }}
              onPress={() => setManageModalOpen(true)}
            >
              Manage Consent Artefacts
            </Button>
          )}
          {!isRevoked ? (
            <Button
              mode="outlined"
              style={{ marginTop: 8, borderRadius: 12 }}
              onPress={revokeConnection}
            >
              Revoke Connection
            </Button>
          ) : (
            <Button
              mode="contained-tonal"
              style={{ marginTop: 8, borderRadius: 12 }}
              onPress={establishConnection}
            >
              Establish Connection
            </Button>
          )}
          {isRevoked && (
            <Text variant="bodySmall" style={{ marginTop: 6, color: "#c62828" }}>
              Connection Revoked — actions are disabled until re-established.
            </Text>
          )}
        </Card.Content>
      </Card>

      {!isHost && obligations.length > 1 && (
        <Card style={[styles.card, { marginTop: 12 }]}>
          <Card.Content>
            <Text variant="titleSmall" style={{ marginBottom: 8 }}>
              Select artefact to review
            </Text>
            <RadioButton.Group
              onValueChange={(val) => setActiveObligationId(val)}
              value={activeObligationId ?? ""}
            >
              {obligations.map((obl) => (
                <List.Item
                  key={obl.id}
                  title={obl.name}
                  description={`Status: ${obl.status}`}
                  left={() => <RadioButton value={obl.id} />}
                  onPress={() => setActiveObligationId(obl.id)}
                />
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>
      )}

      <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 6 }}>
        Active Consent Artefact
      </Text>
      <Text variant="bodySmall" style={{ marginBottom: 8 }}>
        {isHost
          ? "Host can select resources and edit artefact metadata. Guest will review and approve/reject."
          : "Review the consent artefacts and approve or reject. Resource selection is host-only."}
      </Text>

      {activeObligation ? (
        <ObligationCard
          key={activeObligation.id}
          obligation={activeObligation}
          roleLabel={`Owner: ${connection.host.locker} → Receiver: ${connection.guest.locker}`}
          canSelectResource={isHost && !isRevoked}
          canDecide={!isHost && Boolean(activeObligation.dataElement) && !isRevoked}
          canEdit={isHost && !isRevoked}
          disabledActions={isRevoked}
          onSelectResource={() => openResourceSelector(activeObligation.id)}
          onDecision={(decision) => handleDecision(activeObligation.id, decision)}
          onViewArtefact={() => setArtefactToView(activeObligation)}
          onEdit={() => handleEdit(activeObligation)}
        />
      ) : (
        <Card style={{ marginVertical: 8 }}>
          <Card.Content>
            <Text>No consent artefacts available.</Text>
          </Card.Content>
        </Card>
      )}

      <ResourceSelector
        visible={resourceModalOpen}
        resources={RESOURCES}
        selectedId={selectedResourceId}
        onSelect={setSelectedResourceId}
        onSubmit={handleResourceSubmit}
        onDismiss={() => setResourceModalOpen(false)}
      />

      <Portal>
        <Modal
          visible={Boolean(artefactToView)}
          onDismiss={() => setArtefactToView(null)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.outline }
          ]}
        >
          {artefactToView && (
            <>
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                Consent Artefact
              </Text>
              <Text variant="titleSmall">{artefactToView.name}</Text>
              <Divider style={{ marginVertical: 8 }} />
              <List.Item title="Purpose" description={artefactToView.consentArtefact.purpose} />
              <List.Item title="Duration" description={artefactToView.consentArtefact.duration} />
              <List.Item
                title="Owner Locker"
                description={artefactToView.consentArtefact.ownerLocker}
              />
              <List.Item
                title="Receiver Locker"
                description={artefactToView.consentArtefact.receiverLocker}
              />
              <List.Item
                title="Selected Resource"
                description={artefactToView.dataElement || "Not selected"}
              />
              <List.Section title="Conditions">
                {artefactToView.consentArtefact.conditions.map((condition) => (
                  <List.Item key={condition} title={condition} left={(props) => <List.Icon {...props} icon="shield-check" />} />
                ))}
              </List.Section>
              <Button mode="contained" onPress={() => setArtefactToView(null)}>
                Close
              </Button>
            </>
          )}
        </Modal>

        <Modal
          visible={Boolean(editingObligation)}
          onDismiss={() => setEditingObligation(null)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.outline }
          ]}
        >
          {editingObligation && (
            <>
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                Edit Consent Artefact
              </Text>
              <Text variant="titleSmall">{editingObligation.name}</Text>
              <Divider style={{ marginVertical: 8 }} />
            <TextInput
              label="Purpose"
              mode="outlined"
              value={editPurpose}
              onChangeText={setEditPurpose}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Duration"
              mode="outlined"
              value={editDuration}
              onChangeText={setEditDuration}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Conditions (one per line)"
              mode="outlined"
              value={editConditions}
              onChangeText={setEditConditions}
              multiline
              numberOfLines={4}
              style={{ marginBottom: 8 }}
            />
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
                <Button onPress={() => setEditingObligation(null)} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={saveEdit}>
                  Save
                </Button>
              </View>
            </>
          )}
        </Modal>

        <Modal
          visible={manageModalOpen}
          onDismiss={() => setManageModalOpen(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.outline }
          ]}
        >
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
            Select Consent Artefact
          </Text>
          <RadioButton.Group
            onValueChange={(val) => {
              setActiveObligationId(val);
              setManageModalOpen(false);
            }}
            value={activeObligationId ?? ""}
          >
            {obligations.map((obl) => (
              <List.Item
                key={obl.id}
                title={obl.name}
                description={`Status: ${obl.status}`}
                left={() => <RadioButton value={obl.id} />}
                onPress={() => {
                  setActiveObligationId(obl.id);
                  setManageModalOpen(false);
                }}
              />
            ))}
          </RadioButton.Group>
          <Button mode="outlined" onPress={() => setManageModalOpen(false)} style={{ marginTop: 12 }}>
            Close
          </Button>
        </Modal>
      </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa"
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6fa"
  },
  card: {
    elevation: 1,
    borderRadius: 12,
    marginBottom: 12
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6
  },
  modalContainer: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1
  }
});

export default ConnectionDetailScreen;

