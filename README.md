# Consent Locker (Expo + React Native)

A mobile-first Consent Management and Access Control demo application built using *Expo*, *React Native*, *TypeScript*, *Firebase Email/Password Authentication*, *React Navigation*, and *React Native Paper*.

The goal of this project is to demonstrate a clear understanding of consent semantics, role-based behavior, and UX clarity, rather than backend completeness.

---

## 1. System Semantics

### Locker
A **Locker** is a secure container owned by a user.  
It holds **references to data**, not the actual data itself.

- A user can have multiple lockers
- No real files are transferred or stored

---

### Connection
A **Connection** is a logical relationship between two lockers.

- Consent artefacts can exist only within an established connection
- Connection states:
  - `Established`
  - `Revoked`
- Both parties can revoke or re-establish a connection

---

### Consent Artefact
A **Consent Artefact** is a permission contract tied to:

- One **owner locker** (Host)
- One **receiver locker** (Guest)
- One **connection**

It defines:
- Data reference (file)
- Purpose
- Duration
- Conditions

Both parties can **view** the consent artefact.  
The receiver explicitly **approves or rejects** it.

> No real data moves — only permissions and references are represented.

---

## 2. Scenario Implemented

- **Host:** LIC Insurance  
- **Guest:** Kaveri Hospital  
- **Connection:** *Felicitation between Kaveri and LIC Insurance*  
- **Initial Status:** Established

The Host manages consent artefacts related to **Insurance Claim Receipt** or other references.  
The Guest reviews each consent artefact and approves or rejects it.

A single connection can contain multiple consent artefacts, each independently managed.

---

## 3. Authentication

- Firebase Email/Password authentication
- No mock authentication
- No signup or registration flow

### Demo Users (Pre-created in Firebase)

- **LIC Insurance (HOST)**  
  `lic@demo.com` / `lic@123456`

- **Kaveri Hospital (GUEST)**  
  `kaveri@demo.com` / `kaveri@123456`

---

## 4. Application Flow

```
App Launch
 → Firebase Auth Check
 → Login Screen
 → Connections List
 → Connection Details
 → Consent Artefact Management / Review
```

---

## 5. Key Screens & Behavior

### Login Screen
- Email and password login
- Firebase authentication only
- Persistent login state

### Connections List
- Displays all connections for the logged-in user
- Each connection card shows:
  - Connection name
  - Status badge (Established / Revoked)
- Tapping a connection opens **Connection Details**

### Connection Details
Displays:
- Connection metadata
- Host ↔ Guest locker mapping
- Connection status
- Role-based actions

Both Host and Guest can:
- Revoke an established connection
- Re-establish a revoked connection

---

## 6. Consent Artefacts

A single connection can contain **multiple consent artefacts**.

### Host (Data Owner – LIC Insurance)
The Host can:
- Manage consent artefacts
- Select which artefact is active using **Manage Consent Artefacts**
- Edit consent artefact metadata:
  - Purpose
  - Duration
  - Conditions
- Select a resource (file reference)
- View consent artefacts in read-only mode

### Guest (Data Receiver – Kaveri Hospital)
The Guest cannot:
- Edit consent artefacts
- Select or change resources

The Guest can:
- View consent artefacts
- Approve or reject each artefact independently

---

## 7. View Consent Artefact

A read-only modal showing:
- Consent artefact name
- Purpose
- Duration
- Owner locker
- Receiver locker
- Conditions
- Selected resource (file reference)

This view is available to both Host and Guest.

---

## 8. Resource Selection

- Resource selection attaches a **file reference** to a consent artefact
- Resource list may include unrelated files
- Host selects the appropriate file
- Guest only sees the selected resource

---

## 9. Connection State Handling

- **Revoke Connection**
  - Disables consent actions
  - Artefacts remain visible but read-only

- **Establish Connection**
  - Re-enables consent actions
  - Applies to the same existing connection (no new connection is created)

Only one of these actions is visible at a time, based on connection state.

---

## 10. UX Safeguards

- Confirmation dialogs for destructive actions:
  - Revoke Connection
  - Reject Consent Artefact
- Clear empty-state messaging:
  - No connections available
  - No consent artefacts available
- Disabled actions are visually indicated when connection is revoked
- UI grouped into clear sections for readability

---

## 11. State Handling

- Consent artefacts, resource selections, and approval statuses are stored locally using **AsyncStorage**
- This simulates shared visibility across logins for demo purposes
- No backend APIs are required

---

## 12. Project Structure

```
src/
 ├── components/       // Cards, badges, selectors
 ├── context/          // Auth context (Firebase)
 ├── data/             // Scenario + mock artefacts/resources
 ├── navigation/       // Stack navigator
 └── screens/          // Login, connections list, details
```

---

## 13. Running the App

```bash
npm install
npm start
```

Run the app on an emulator or physical device using **Expo Go**.

---

## 14. Design Decisions, Assumptions & Limitations

### Design Decisions
- Consent semantics are enforced at the UI layer
- Authoring a consent artefact implies Host agreement
- Guest explicitly approves or rejects
- Connection lifecycle is independent of consent artefacts

### Assumptions & Limitations
- Domain data is mocked
- No real file uploads or transfers

---
