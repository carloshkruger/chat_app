type WebSocketErrorMessageProps = {
  message: string;
};

export function WebSocketErrorMessage({ message }: WebSocketErrorMessageProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <p>{message}</p>
    </div>
  );
}
