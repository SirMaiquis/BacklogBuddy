import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WelcomeMessageProps {
  onDismiss: () => void;
}

export function WelcomeMessage({ onDismiss }: WelcomeMessageProps) {
  return (
    <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
      <h2 className="text-2xl font-bold mb-4">Welcome to Backlog Buddy! 🎮</h2>
      <p className="mb-6">
        Did you know you can automatically import your games from Steam? Save
        time and get started right away!
      </p>
      <div className="flex gap-4">
        <Link to="/settings">
          <Button>Let's import them</Button>
        </Link>
        <Button variant="outline" onClick={onDismiss}>
          Nah, I'm good
        </Button>
      </div>
    </Card>
  );
}
