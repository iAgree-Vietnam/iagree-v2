import { useSession } from "@/lib/shim/next-auth-react";
import { useEffect } from "react";

const gtag = (command: string, ...args: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag(command, ...args);
    }
}

function GtagAuthHandler({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const userId = session.user.id;

            gtag('config', process.env.GOOGLE_ANALYTICS_ID, {
                'user_id': userId
            });

            gtag('set', 'user_properties', {
                'custom_user_id': userId
            });

        }
    }, [status, session]);

    return <>{children}</>;
}

export default GtagAuthHandler;