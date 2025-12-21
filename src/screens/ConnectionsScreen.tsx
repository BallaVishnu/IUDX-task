import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import ConnectionCard from "../components/ConnectionCard";
import { CONNECTIONS } from "../data/mockData";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

type Navigation = NativeStackNavigationProp<RootStackParamList, "Connections">;

const ConnectionsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { role, user, logout, loading } = useAuth();

  const orgKey = (user?.email ?? "").toLowerCase().split("@")[0] || "";

  const visibleConnections =
    role === "HOST"
      ? CONNECTIONS.filter((c) => c.host.name.toLowerCase().includes(orgKey))
      : CONNECTIONS.filter((c) => c.guest.name.toLowerCase().includes(orgKey));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Signed in as {user?.email}</Text>
        <Text variant="bodySmall">Connection roles vary per connection</Text>
        <Button mode="outlined" onPress={logout} style={styles.logoutButton} loading={loading}>
          Logout
        </Button>
      </View>
      <FlatList
        data={visibleConnections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConnectionCard
            connection={item}
            onPress={() => navigation.navigate("ConnectionDetail", { connectionId: item.id })}
          />
        )}
        ListHeaderComponent={
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            Connections
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6fa"
  },
  header: {
    marginBottom: 12
  },
  logoutButton: {
    marginTop: 8,
    alignSelf: "flex-start"
  }
});

export default ConnectionsScreen;

