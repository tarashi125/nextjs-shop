import { requireAuth } from "@/lib/auth";

export default  async function OrderLayout({children}) {
    await requireAuth();
    return (
        <>{children}</>
    );
}
