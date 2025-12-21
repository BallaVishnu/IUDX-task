# Consent Locker (Expo + React Native)

Mobile-first consent management and access control demo built with Expo, React Native, TypeScript, Firebase Email/Password auth, React Navigation, and React Native Paper.

## System Semantics
- **Locker:** Secure container owned by a user, holds data references (no real data).
- **Connection:** Logical link between two lockers; data/consent exists only within an established connection.
- **Consent Artefact:** Tied to one locker (owner) and one connection (receiver). Defines data reference, purpose, duration, conditions. Both parties can view, approve/reject, and revoke.
- **No real data moves**—only permissions and references.

## Scenario Implemented
- **Host:** LIC Insurance  
- **Guest:** Kaveri Hospital  
- **Connection:** “Felicitation between Kaveri and LIC Insurance” (status: Established)  
- Host obligations include sharing an Insurance Claim Receipt reference; guest reviews and approves/rejects.

## Authentication
- Firebase Email/Password (no mock auth, no signup).
- Demo users (already in Firebase):
  - LIC Insurance (HOST): `lic@demo.com` / `lic@123456`
  - Kaveri Hospital (GUEST): `kaveri@demo.com` / `kaveri@123456`
- Role logic: `email.includes("lic") ? "HOST" : "GUEST"`.
- Auth persistence via `onAuthStateChanged`.

### Firebase config
Provide Firebase web config via Expo public env vars (e.g. `.env`):
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## App Flow
App Launch → Firebase Auth Check → Login → Connections List → Connection Details → Consent Management.

Key screens (mobile-friendly cards):
- **Login:** Email/password, Firebase sign-in only.
- **Connections:** Shows connection name + status badge; tap to open.
- **Connection Details:** Connection summary, host↔guest locker mapping, Manage Consent CTA, host obligations shown as cards.
- **Resource Selection:** Modal/bottom sheet listing resources; submit updates obligation.
- **Opposite User Review:** Other party sees the same obligation, can view consent artefact, approve/reject, and save decision. Status reflects for both users.

State for obligations/resource selections is persisted locally with AsyncStorage to simulate shared visibility across logins.

## Project Structure
```
src/
 ├── components/       // Cards, badges, selectors
 ├── context/          // Auth context (Firebase)
 ├── data/             // Scenario + mock resources/obligations
 ├── navigation/       // Stack navigator
 └── screens/          // Login, connections list, detail
```

## Running the App
1. `npm install`
2. Add Firebase env vars (see above).
3. `npm start` (or `npx expo start`) and run on simulator/device.

## Assumptions & Limitations
- Single demo connection; easily extendable via `src/data/mockData.ts`.
- No backend APIs; consent state is local (AsyncStorage) for stability in the demo.
- No upload/file transfer—only references to resources.
- UI optimized for clarity over pixel perfection; uses cards instead of tables for mobile.

