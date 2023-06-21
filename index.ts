import {
    getFirestore,
    CollectionReference,
    QuerySnapshot,
} from "firebase-admin/firestore";
import { Session } from "@shopify/shopify-api";
import { SessionStorage } from "@shopify/shopify-app-session-storage";
import { initializeApp, cert } from "firebase-admin/app";

interface FireStoreSessionStorageOptions {
    sessionCollectionName: string;
}
const defaultFireStoreSessionStorageOptions: FireStoreSessionStorageOptions = {
    sessionCollectionName: "shopify_sessions",
};

export class FireStoreSessionStorage implements SessionStorage {
    public readonly ready: Promise<void>;
    private options: FireStoreSessionStorageOptions;
    private sessionID: string;
    private client: any;
    private certificate: string;

    constructor(
        _cert: any,
        opts: Partial<FireStoreSessionStorageOptions> = {}
    ) {
        this.options = { ...defaultFireStoreSessionStorageOptions, ...opts };
        this.certificate = _cert;
        this.ready = this.init();
    }

    public async storeSession(session: Session): Promise<boolean> {
        await this.ready;
        let data: any = {};

        session.toPropertyArray().forEach((val) => {
            data[val[0]] = val[1];
        });

        this.sessionID = session.id;

        const result = await this.collection
            .doc(this.sessionID)
            .get()
            .then(
                async (sessionSnapshot: FirebaseFirestore.DocumentSnapshot) => {
                    if (sessionSnapshot.exists) {
                        return await this.sessionRef.update(data);
                    } else {
                        return await this.sessionRef.set(data);
                    }
                }
            );

        return result.writeTime ? true : false;
    }

    public async loadSession(id: string): Promise<Session | undefined> {
        await this.ready;
        this.sessionID = id;
        let sessionParams: Array<any> = [];
        await this.collection
            .doc(id)
            .get()
            .then(async (sessionSnapshot) => {
                if (sessionSnapshot.exists) {
                    let data = sessionSnapshot.data();
                    for (var key in data) {
                        sessionParams.push([key, data[key]]);
                    }
                }
            });

        return this.sessionRef
            ? Session.fromPropertyArray(sessionParams)
            : undefined;
    }

    public async deleteSession(id: string): Promise<boolean> {
        await this.ready;
        this.sessionID = id;
        await this.sessionRef.delete();
        return true;
    }

    public async deleteSessions(ids: string[]): Promise<boolean> {
        await this.ready;
        ids.forEach((id) => {
            this.deleteSession(id);
        });
        return true;
    }

    public async findSessionsByShop(shop: string): Promise<Session[]> {
        await this.ready;
        return this.collection
            .where("shop", "==", shop)
            .get()
            .then(async (sessionSnapshot: QuerySnapshot) => {
                let sessions: Array<Session> = [];
                sessionSnapshot.forEach(
                    (docSnapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
                        let sessionParams: Array<any> = [];

                        let data: FirebaseFirestore.DocumentData =
                            docSnapshot.data();
                        for (var key in data) {
                            sessionParams.push([key, data[key]]);
                        }
                        sessions.push(Session.fromPropertyArray(sessionParams));
                    }
                );
                return sessions;
            });
    }

    private get collection(): CollectionReference {
        return this.client.collection(this.options.sessionCollectionName);
    }

    private get sessionRef(): FirebaseFirestore.DocumentData {
        return this.collection.doc(this.sessionID);
    }

    private async init() {
        initializeApp({
            credential: cert(this.certificate),
        });
        this.client = getFirestore();
    }
}
