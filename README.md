# codveda-fullstack-tasks-task-2
Full-stack development internship assignments for Codveda Technologies. This is the intermediate level and Advanced level. 
In this repository, I got to do all the tasks provided in the internship for both intermediate and advanced.
Here is what i achieved:
=> Role-Based Access Control (RBAC) & Security
​Backend Authorization Middleware: Developed a custom authorizeRoles restriction layer in Express to intercept incoming API queries based on token scopes.
​Database Schema Expansion: Updated the MongoDB User schema properties with an enumerated role parameter defaulting strictly to "user".
​Protected Ledger Endpoints: Encapsulated sensitive backend data routes (specifically transaction deletions) so they are mathematically restricted exclusively to authenticated users with "admin" status, returning a secure 403 Forbidden error handling block for unauthorized attempts.
​=> Real-Time Event-Driven Architecture (WebSockets)
​Bidirectional Proxy Gateway: Built a live synchronization network layer by bridging the native Node.js HTTP server module with Socket.io.
​Cross-Origin Resource Sharing (CORS): Fully calibrated strict network route access configurations to allow seamless handshakes between the backend server (Port 4000) and the Vite/React frontend environment (Port 5173).
​Instant High-Spending Triggers: Implemented automated server-side triggers that detect whenever a log exceeds $500, broadcasting a real-time event to the frontend client without requiring any page reloads or layout re-renders.
=> Frontend UI/UX Optimization
​State Preservation & Handshakes: Programmed a specialized React client-side useEffect hook to gracefully mount connections, execute background cleanups, and manage live message variables.
​Floating Toast Notification System: Designed clean, fixed-position overlay alert components (position: 'fixed', zIndex: 9999) to prevent layout breaking or column shifting, ensuring a perfectly symmetric and responsive dual-column dashboard.
