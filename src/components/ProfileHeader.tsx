import { UserResource } from "@clerk/types";
import CornerElements from "./CornerElements";

const ProfileHeader = ({ user }: { user: UserResource | null | undefined }) => {
  if (!user) return null;
  return (
    <div className="mb-10 relative backdrop-blur-sm border border-border  p-6">
      <CornerElements />

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-foreground">{user.fullName}</span>
          </h1>
          <div className="flex items-center bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></div>
            <p className="text-xs font-mono text-primary">USER ACTIVE</p>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50 my-2"></div>
        <p className="text-muted-foreground font-mono">
          {user.primaryEmailAddress?.emailAddress}
        </p>
      </div>
    </div>
  );
};
export default ProfileHeader;
