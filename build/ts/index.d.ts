import { Session } from "@shopify/shopify-api";
import { SessionStorage } from "@shopify/shopify-app-session-storage";
interface FireStoreSessionStorageOptions {
    sessionCollectionName: string;
}
declare class FireStoreSessionStorage implements SessionStorage {
    readonly ready: Promise<void>;
    private options;
    private certificate;
    private sessionID;
    private client;
    constructor(_cert: string, opts?: Partial<FireStoreSessionStorageOptions>);
    storeSession(session: Session): Promise<boolean>;
    loadSession(id: string): Promise<Session | undefined>;
    deleteSession(id: string): Promise<boolean>;
    deleteSessions(ids: string[]): Promise<boolean>;
    findSessionsByShop(shop: string): Promise<Session[]>;
    private get collection();
    private get sessionRef();
    private init;
}
export default FireStoreSessionStorage;
//# sourceMappingURL=index.d.ts.map