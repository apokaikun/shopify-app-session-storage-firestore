import { Session } from "@shopify/shopify-api";
import { SessionStorage } from "@shopify/shopify-app-session-storage";
interface FireStoreSessionStorageOptions {
    sessionCollectionName: string;
}
export declare class FireStoreSessionStorage implements SessionStorage {
    readonly ready: Promise<void>;
    private options;
    private sessionID;
    private client;
    private certificate;
    constructor(_cert: any, opts?: Partial<FireStoreSessionStorageOptions>);
    storeSession(session: Session): Promise<boolean>;
    loadSession(id: string): Promise<Session | undefined>;
    deleteSession(id: string): Promise<boolean>;
    deleteSessions(ids: string[]): Promise<boolean>;
    findSessionsByShop(shop: string): Promise<Session[]>;
    private get collection();
    private get sessionRef();
    private init;
}
export {};
//# sourceMappingURL=index.d.ts.map