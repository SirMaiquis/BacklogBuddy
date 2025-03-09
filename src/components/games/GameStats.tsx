import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game } from "@/types/game";
import { Clock, Award, BarChart2, ListChecks, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GameStatsProps {
  games: Game[];
}

export function GameStats({ games }: GameStatsProps) {
  const totalGames = games.length;
  const backlogGames = games.filter((game) => game.status === "backlog").length;
  const playingGames = games.filter((game) => game.status === "playing").length;
  const completedGames = games.filter(
    (game) => game.status === "completed",
  ).length;
  const favoriteGames = games.filter((game) => game.favorite).length;

  const totalPlaytime = games.reduce(
    (sum, game) => sum + (game.playtime || 0),
    0,
  );

  const completionRate =
    totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Card className="overflow-hidden border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
          <CardTitle className="text-sm font-medium">Total Games</CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ListChecks className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold">{totalGames}</div>
          <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {backlogGames}
              </span>
              <span>Backlog</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {playingGames}
              </span>
              <span>Playing</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {completedGames}
              </span>
              <span>Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-500/5">
          <CardTitle className="text-sm font-medium">Total Playtime</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold">
            {totalPlaytime}{" "}
            <span className="text-lg font-normal text-muted-foreground">
              hours
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Across {totalGames} games in your collection
          </p>
          {totalGames > 0 && (
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                <span>Average per game</span>
                <span>{Math.round(totalPlaytime / totalGames)} hrs</span>
              </div>
              <Progress
                value={Math.min(100, totalPlaytime / totalGames / 0.5)}
                className="h-1.5"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-t-4 border-t-green-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-500/5">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Award className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold">{completionRate}%</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {completedGames} of {totalGames} games completed
          </p>
          <div className="mt-3">
            <Progress value={completionRate} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-t-4 border-t-purple-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-500/5">
          <CardTitle className="text-sm font-medium">
            Currently Playing
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <BarChart2 className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold">{playingGames}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Active games, with {backlogGames} in backlog
          </p>
          {totalGames > 0 && (
            <div className="mt-3">
              <div className="flex w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${(playingGames / totalGames) * 100}%` }}
                ></div>
                <div
                  className="h-full bg-slate-500"
                  style={{ width: `${(backlogGames / totalGames) * 100}%` }}
                ></div>
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(completedGames / totalGames) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-t-4 border-t-yellow-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-500/5">
          <CardTitle className="text-sm font-medium">Favorites</CardTitle>
          <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold">{favoriteGames}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Games marked as favorites
          </p>
          {totalGames > 0 && (
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                <span>Percentage of collection</span>
                <span>{Math.round((favoriteGames / totalGames) * 100)}%</span>
              </div>
              <Progress
                value={(favoriteGames / totalGames) * 100}
                className="h-1.5"
                indicatorClassName="bg-yellow-500"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
