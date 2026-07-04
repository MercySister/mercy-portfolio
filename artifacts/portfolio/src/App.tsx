import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useEffect, useRef } from "react";

function BackgroundRibbons() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ribbons = [
      { amp: 60,  freq: 0.0012, speed: 0.0004, yBase: 0.18, alpha: 0.045 },
      { amp: 80,  freq: 0.0009, speed: 0.0003, yBase: 0.35, alpha: 0.03  },
      { amp: 50,  freq: 0.0015, speed: 0.0005, yBase: 0.52, alpha: 0.04  },
      { amp: 90,  freq: 0.0008, speed: 0.00025,yBase: 0.68, alpha: 0.025 },
      { amp: 40,  freq: 0.0018, speed: 0.0006, yBase: 0.82, alpha: 0.035 },
      { amp: 70,  freq: 0.001,  speed: 0.00035,yBase: 0.95, alpha: 0.02  },
    ];

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ribbons.forEach((r, i) => {
        ctx.beginPath();
        const yCenter = canvas.height * r.yBase;
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = yCenter + Math.sin(x * r.freq + t * r.speed * 1000 + i * 1.3) * r.amp
                            + Math.sin(x * r.freq * 1.7 + t * r.speed * 800 + i * 0.7) * r.amp * 0.4;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${r.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BackgroundRibbons />
        {/* Vertical right-side strip — like ticket "SYSTEM FAILURE PROTOCOL" */}
        <div className="fixed right-0 top-0 bottom-0 z-50 w-7 flex items-center justify-center pointer-events-none"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="font-mono text-[8px] tracking-[0.22em] uppercase whitespace-nowrap"
            style={{ color: "rgba(255,255,255,0.18)", transform: "rotate(90deg)" }}>
            System_Status // Online // Portfolio_Active
          </span>
        </div>
        {/* Vertical left-side strip */}
        <div className="fixed left-0 top-0 bottom-0 z-50 w-7 flex items-center justify-center pointer-events-none"
          style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="font-mono text-[8px] tracking-[0.22em] uppercase whitespace-nowrap"
            style={{ color: "rgba(255,255,255,0.18)", transform: "rotate(-90deg)" }}>
            Admit One // Access Granted
          </span>
        </div>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
