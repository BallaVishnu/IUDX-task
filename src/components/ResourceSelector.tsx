import React from "react";
import { View } from "react-native";
import { Button, Modal, Portal, RadioButton, Text, List } from "react-native-paper";
import { Resource } from "../data/mockData";

type Props = {
  visible: boolean;
  resources: Resource[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  onDismiss: () => void;
};

const ResourceSelector: React.FC<Props> = ({
  visible,
  resources,
  selectedId,
  onSelect,
  onSubmit,
  onDismiss
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: "#fff",
          margin: 16,
          borderRadius: 12,
          padding: 16
        }}
      >
        <Text variant="titleMedium" style={{ marginBottom: 12 }}>
          Select Resource
        </Text>
        <RadioButton.Group onValueChange={onSelect} value={selectedId}>
          {resources.map((resource) => (
            <List.Item
              key={resource.id}
              title={resource.name}
              description={resource.description}
              left={() => <RadioButton value={resource.id} />}
              style={{ paddingHorizontal: 0 }}
            />
          ))}
        </RadioButton.Group>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
          <Button onPress={onDismiss} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button mode="contained" onPress={onSubmit} disabled={!selectedId}>
            Submit
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default ResourceSelector;

