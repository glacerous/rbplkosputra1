import { auth } from "@/server/auth/auth";
import { leaseService } from "@/server/services/lease.service";
import PublicLandingView from "@/components/home/PublicLandingView";
import LoggedInNoRoomView from "@/components/home/LoggedInNoRoomView";
import UserDashboardView from "@/components/home/UserDashboardView";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <PublicLandingView />;
  }

  const activeLease = await leaseService.getActiveLeaseByUserId(session.user.id);

  if (!activeLease) {
    return <LoggedInNoRoomView />;
  }

  return <UserDashboardView reservation={activeLease} />;
}
