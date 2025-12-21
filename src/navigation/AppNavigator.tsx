import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import ConnectionsScreen from "../screens/ConnectionsScreen";
import ConnectionDetailScreen from "../screens/ConnectionDetailScreen";
import { useAuth } from "../context/AuthContext";

export type RootStackParamList = {
  Login: undefined;
  Connections: undefined;
  ConnectionDetail: { connectionId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);

const AppNavigator = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen
              name="Connections"
              component={ConnectionsScreen}
              options={{ title: "Connections Home" }}
            />
            <Stack.Screen
              name="ConnectionDetail"
              component={ConnectionDetailScreen}
              options={{ title: "Connection Details" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

