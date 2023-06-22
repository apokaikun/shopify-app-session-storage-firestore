import { __awaiter } from "tslib";
import { getFirestore, } from "firebase-admin/firestore";
import { Session } from "@shopify/shopify-api";
import { initializeApp, cert } from "firebase-admin/app";
const defaultFireStoreSessionStorageOptions = {
    sessionCollectionName: "shopify_sessions",
};
export class FireStoreSessionStorage {
    constructor(_cert, opts = {}) {
        this.options = Object.assign(Object.assign({}, defaultFireStoreSessionStorageOptions), opts);
        this.certificate = _cert;
        this.ready = this.init();
    }
    storeSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            let data = {};
            session.toPropertyArray().forEach((val) => {
                data[val[0]] = val[1];
            });
            this.sessionID = session.id;
            const result = yield this.collection
                .doc(this.sessionID)
                .get()
                .then((sessionSnapshot) => __awaiter(this, void 0, void 0, function* () {
                if (sessionSnapshot.exists) {
                    return yield this.sessionRef.update(data);
                }
                else {
                    return yield this.sessionRef.set(data);
                }
            }));
            return result.writeTime ? true : false;
        });
    }
    loadSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            this.sessionID = id;
            let sessionParams = [];
            yield this.collection
                .doc(id)
                .get()
                .then((sessionSnapshot) => __awaiter(this, void 0, void 0, function* () {
                if (sessionSnapshot.exists) {
                    let data = sessionSnapshot.data();
                    for (var key in data) {
                        sessionParams.push([key, data[key]]);
                    }
                }
            }));
            return this.sessionRef
                ? Session.fromPropertyArray(sessionParams)
                : undefined;
        });
    }
    deleteSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            this.sessionID = id;
            yield this.sessionRef.delete();
            return true;
        });
    }
    deleteSessions(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            ids.forEach((id) => {
                this.deleteSession(id);
            });
            return true;
        });
    }
    findSessionsByShop(shop) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready;
            return this.collection
                .where("shop", "==", shop)
                .get()
                .then((sessionSnapshot) => __awaiter(this, void 0, void 0, function* () {
                let sessions = [];
                sessionSnapshot.forEach((docSnapshot) => {
                    let sessionParams = [];
                    let data = docSnapshot.data();
                    for (var key in data) {
                        sessionParams.push([key, data[key]]);
                    }
                    sessions.push(Session.fromPropertyArray(sessionParams));
                });
                return sessions;
            }));
        });
    }
    get collection() {
        return this.client.collection(this.options.sessionCollectionName);
    }
    get sessionRef() {
        return this.collection.doc(this.sessionID);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            initializeApp({
                credential: cert(this.certificate),
            });
            this.client = getFirestore();
        });
    }
}
//# sourceMappingURL=index.js.map