import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Gamepad2,
  Settings,
  User,
  Trophy,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Floating game card component
const FloatingGameCard = ({
  x,
  y,
  delay,
  image,
  rotation,
}: {
  x: number;
  y: number;
  delay: number;
  image: string;
  rotation: number;
}) => {
  return (
    <motion.div
      className="absolute rounded-lg overflow-hidden shadow-lg border border-primary/20 w-32 h-44 z-0"
      style={{ left: `${x}%`, top: `${y}%`, rotate: `${rotation}deg` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        y: ["-5%", "5%", "-5%"],
        x: ["-2%", "2%", "-2%"],
        rotate: [rotation - 5, rotation + 5, rotation - 5],
      }}
      transition={{
        repeat: Infinity,
        duration: 15 + Math.random() * 10,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <img
        src={image}
        alt="Game cover"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </motion.div>
  );
};

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const [floatingCards, setFloatingCards] = useState<React.ReactNode[]>([]);

  // Game cover images
  const gameCovers = [
    "https://steamcdn-a.akamaihd.net/steam/apps/1086940/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/1174180/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/413150/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/526870/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/367520/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/105600/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/250900/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/322330/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/208650/library_600x900_2x.jpg",
    "https://steamcdn-a.akamaihd.net/steam/apps/255710/library_600x900_2x.jpg",
  ];

  // Generate floating cards on component mount
  useEffect(() => {
    const cards = [];
    // Create 12 floating cards with random positions
    for (let i = 0; i < 12; i++) {
      // Ensure cards are distributed across the viewport
      const section = Math.floor(i / 3); // Divide viewport into 4 sections
      const xMin = (section % 2) * 50; // Left or right half
      const xMax = xMin + 50;
      const yMin = Math.floor(section / 2) * 50; // Top or bottom half
      const yMax = yMin + 50;

      const x = xMin + Math.random() * (xMax - xMin); // Position within section
      const y = yMin + Math.random() * (yMax - yMin);
      const delay = Math.random() * 5; // Random delay (0-5s)
      const image = gameCovers[i % gameCovers.length]; // Cycle through available images
      const rotation = (Math.random() - 0.5) * 20; // Random rotation (-10 to 10 degrees)

      cards.push(
        <FloatingGameCard
          key={i}
          x={x}
          y={y}
          delay={delay}
          image={image}
          rotation={rotation}
        />,
      );
    }
    setFloatingCards(cards);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted overflow-hidden">
      {/* Background floating game cards */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingCards}
      </div>

      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-extrabold">
                Backlog Buddy
              </span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.email || ""}
                        />
                        <AvatarFallback>
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="flex-1 max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeIn}
                className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm backdrop-blur-sm"
              >
                Level up your gaming experience
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-br from-foreground via-primary to-purple-600 bg-clip-text text-transparent tracking-tight"
              >
                Master Your Gaming Backlog
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-muted-foreground mb-8 max-w-xl backdrop-blur-sm bg-background/30 p-4 rounded-lg"
              >
                Track, organize, and conquer your gaming collection. Never lose
                track of your progress or forget which game to play next.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4"
              >
                {user ? (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button
                        size="lg"
                        className="px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
                      >
                        Get Started <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="mt-8 flex items-center gap-6 text-muted-foreground backdrop-blur-sm bg-background/30 p-2 rounded-lg inline-flex"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Cloud synced</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Dark mode</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-primary/20 backdrop-blur-sm bg-background/30">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80"
                  alt="Gaming Dashboard"
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Track Your Achievements</h3>
                      <p className="text-sm text-muted-foreground">
                        Never miss a collectible again
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[100px]" />
              <div className="absolute -bottom-10 -left-10 -z-10 h-[200px] w-[200px] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[80px]" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Manage Your Games
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed for gamers who want to organize their
                collection and track their progress.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-card p-8 rounded-xl shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Gamepad2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Track Your Backlog</h3>
                <p className="text-muted-foreground mb-6">
                  Keep all your games organized in one place. Filter by
                  platform, genre, and completion status to easily find what to
                  play next.
                </p>
                <div className="flex items-center text-primary font-medium">
                  <span>Never lose track of a game</span>
                </div>
              </motion.div>

              <motion.div
                className="bg-card p-8 rounded-xl shadow-lg border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-blue-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Monitor Progress</h3>
                <p className="text-muted-foreground mb-6">
                  Track playtime, completion percentage, and achievements for
                  each game. Set goals and watch your stats grow as you play.
                </p>
                <div className="flex items-center text-blue-500 font-medium">
                  <span>Visualize your gaming journey</span>
                </div>
              </motion.div>

              <motion.div
                className="bg-card p-8 rounded-xl shadow-lg border border-green-500/10 hover:border-green-500/30 transition-all duration-300"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-green-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-green-500"
                  >
                    <path d="M12 15c5.5 0 10-2.5 10-8.5V4.5C22 3.7 21.3 3 20.5 3h-17C2.7 3 2 3.7 2 4.5V6.5C2 12.5 6.5 15 12 15Z" />
                    <path d="M12 15v6" />
                    <path d="M8 21h8" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Record Thoughts</h3>
                <p className="text-muted-foreground mb-6">
                  Keep notes on each game to remember your experiences,
                  strategies, or thoughts for future reference and sharing with
                  friends.
                </p>
                <div className="flex items-center text-green-500 font-medium">
                  <span>Document your gaming memories</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden z-10">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-sm bg-background/30 p-8 rounded-xl border border-primary/10"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
                Ready to Level Up Your Gaming Experience?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of gamers who are organizing their collections
                and tracking their progress with Backlog Buddy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="px-10 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="px-10 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
                    >
                      Get Started For Free
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Backlog Buddy</span>
              </div>

              <div className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Backlog Buddy. All rights
                reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
