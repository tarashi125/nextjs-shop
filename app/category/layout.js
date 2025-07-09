import { requireAuth } from "@/lib/auth";

export default  async function CategoryLayout({children}) {
    await requireAuth();
    return (
        <>{children}</>
    );
}
