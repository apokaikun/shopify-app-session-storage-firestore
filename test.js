import { FireStoreSessionStorage } from ".";
import { Session } from "@shopify/shopify-api";

const serviceAccount = process.cwd() + "/rock-flag-357102-1cd6f821f1b2.json";

const db = new FireStoreSessionStorage(serviceAccount);
const session = new Session({
    shop: "test.myshopify.com",
    state: "offline",
    isOnline: false,
    scope: ["write_products"],
    accessToken: "abcdefg",
});
db.storeSession(session);
