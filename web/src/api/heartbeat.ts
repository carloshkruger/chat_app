export function sendHeartbeat(userId: string) {
  return;
  fetch("http://localhost:3000/heartbeat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  });
}