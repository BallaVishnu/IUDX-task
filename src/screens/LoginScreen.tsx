import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("lic@demo.com");
  const [password, setPassword] = useState("lic@123456");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }
    setLocalError(null);
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Consent Locker
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
            Login with the provided demo credentials. Authentication is handled by Firebase
            Email/Password.
          </Text>
          <TextInput
            label="Email"
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            label="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={{ marginBottom: 4 }}
          />
          <HelperText type="info">LIC: lic@demo.com / lic@123456</HelperText>
          <HelperText type="info">Kaveri: kaveri@demo.com / kaveri@123456</HelperText>
          {(error || localError) && (
            <HelperText type="error" visible>
              {localError || error}
            </HelperText>
          )}
          <Button mode="contained" onPress={handleSubmit} loading={loading} style={{ marginTop: 8 }}>
            Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f6fa"
  },
  card: {
    elevation: 2
  },
  title: {
    marginBottom: 8
  }
});

export default LoginScreen;

