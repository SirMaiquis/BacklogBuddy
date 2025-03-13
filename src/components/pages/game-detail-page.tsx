import { GameDetail } from "../games/GameDetail";

import { Header } from "@/components/layout/Header";

export default function GameDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GameDetail />
    </div>
  );
}
