import { requireAuth } from "@/lib/auth";

export default  async function ProductLayout({children}) {
    await requireAuth();
    return (
        <>{children}</>
    );
}
