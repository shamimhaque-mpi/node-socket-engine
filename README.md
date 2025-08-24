# Node.js WS Engine

A lightweight WebSocket engine built with Node.js (no external libraries) for real-time communication.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/nodejs-ws-engine.git
cd nodejs-ws-engine
```

### 2. Run the server
```bash
npm run dev
```

Server will start at:
```
ws://localhost:8080
```

---

## 🔑 Connection Requirements

Clients **must** provide a `client_key` in the request headers when connecting.

### Example headers:
```json
{
  "client_key": "provided client key"
}
```

---

## 📤 Sending Messages

- Message type: **JSON**
- Format:
```json
{
  "client_key": "shamim",
  "message": "Hi!! sent from shamim"
}
```

---

## 📥 Receiving Messages

- Message type: **JSON**
- Format:
```json
{
  "client_key": "shamim",
  "message": "Hi!! sent from shamim"
}
```

---

## 🛠 Example Client (Browser)

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      const socket = new WebSocket("ws://localhost:8080", {
        headers: {
          client_key: "shamim123"
        }
      });

      socket.onopen = () => {
        console.log("Connected!");
        socket.send(JSON.stringify({
          client_key: "shamim",
          message: "Hi!! sent from shamim"
        }));
      };

      socket.onmessage = (event) => {
        console.log("Received:", event.data);
      };
    </script>
  </body>
</html>
```

---

## 📌 Notes
- Every client must send a valid `client_key` during connection.
- Messages must be JSON formatted.
- The server echoes messages back in the same format.

---

## 📜 License
This project is open-source and free to use under the [MIT License](LICENSE).
