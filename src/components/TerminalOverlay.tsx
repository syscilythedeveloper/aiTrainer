const TerminalOverlay = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 ">
      <div className="relative bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded-lg p-3 overflow-hidden font-mono">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-2 border-b border-border pb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-primary blink"
              style={{ backgroundColor: "#38f882" }}
            ></div>
            <p className="text-xs text-primary">Sample Starter</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Strength Building Plan
          </p>
        </div>

        <p className="text-sm text-foreground mb-2 tracking-tight">
          <span className="text-primary"></span> WORKOUT ANALYSIS COMPLETE
        </p>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-x-8">
            <div>
              <div className="text-primary mr-2">Monday - Upper Body Push</div>
              <li>Barbell Bench Press 4x8</li>
              <li>Incline Dumbell Press 4x8</li>
              <li>Overhead Press 4x6</li>
              <li>Tricep Extension 3x12</li>
            </div>
            <div>
              <div className="text-primary mr-2">Tuesday - Lower Body</div>
              <li>Back Squat 4x8</li>
              <li>Romanian Deadlift 4x8</li>
              <li>Bulgarian Split Squats 4x8</li>
              <li>Hip Thrusts 4x8</li>
            </div>
          </div>
          <div className="flex items-center gap-x-8">
            <div>
              <div className="text-primary mr-2">
                Thursday - Upper Body Pull{" "}
              </div>
              <li>Deadlift 4x6</li>
              <li>Pull-ups/Chin-ups 4x8</li>
              <li>Barbell Rows 4x10</li>
              <li>Face Pulls 3x15</li>
            </div>
            <div>
              <div className="text-primary mr-2">Friday - Full Body</div>
              <li>Box Jumps 3x10</li>
              <li>Medicine Ball Throws 3x10</li>
              <li>Bent-over Row 4x8</li>
              <li>PUsh Press 4x8</li>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TerminalOverlay;
