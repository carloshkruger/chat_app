import { Button } from "./ui/button";

export function ConnectionLost() {
  function reloadPage() {
    window.location.reload();
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <p>Connection lost.</p>
      <Button variant="outline" onClick={reloadPage}>
        Reload page
      </Button>
    </div>
  );
}
