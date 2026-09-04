import { useEffect } from "react";
import { useTimerStore } from "@/stores/useTimerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Square, Tag, DollarSign } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SAMPLE_PROJECTS = [
    { name: "Frontend Development", color: "#3b82f6" },
    { name: "API Integration", color: "#10b981" },
    { name: "Design System", color: "#8b5cf6" },
    { name: "Internal Admin", color: "#64748b" },
];

export function TrackerBar() {
    const {
        isTracking,
        description,
        projectName,
        projectColor,
        isBillable,
        elapsedSeconds,
        setDescription,
        setProject,
        toggleBillable,
        startTimer,
        stopTimer,
        tick,
    } = useTimerStore();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTracking) {
            timer = setInterval(tick, 1000);
        }
        return () => clearInterval(timer);
    }, [isTracking, tick]);

    const formatTime = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600).toString().padStart(2, "0");
        const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, "0");
        const s = (totalSecs % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="w-full bg-white border border-slate-200 rounded-md shadow-sm px-4 py-2 flex items-center gap-3">
            <Input
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-none shadow-none text-sm focus-visible:ring-0 flex-1 px-0 placeholder:text-slate-400"
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs font-medium text-slate-700 hover:bg-slate-100">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: projectColor }}
                        />
                        {projectName}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    {SAMPLE_PROJECTS.map((proj) => (
                        <DropdownMenuItem
                            key={proj.name}
                            onClick={() => setProject(proj.name, proj.color)}
                            className="gap-2 text-xs cursor-pointer"
                        >
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.color }} />
                            {proj.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-5 w-px bg-slate-200" />

            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                <Tag className="w-4 h-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggleBillable}
                className={`h-8 w-8 ${isBillable ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-700"}`}
            >
                <DollarSign className="w-4 h-4" />
            </Button>

            <div className="h-5 w-px bg-slate-200" />

            <span className="font-mono text-base font-semibold tracking-wider px-2 min-w-[75px] text-center text-slate-800">
                {formatTime(elapsedSeconds)}
            </span>

            <Button
                onClick={isTracking ? stopTimer : startTimer}
                className={`h-9 px-4 font-semibold text-xs tracking-wider transition-colors ${isTracking ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
            >
                {isTracking ? (
                    <>
                        <Square className="w-3.5 h-3.5 mr-1.5 fill-current" /> STOP
                    </>
                ) : (
                    <>
                        <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> START
                    </>
                )}
            </Button>
        </div>
    );
}