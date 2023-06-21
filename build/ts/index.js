"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var app_1 = require("firebase-admin/app");
var firestore_1 = require("firebase-admin/firestore");
var shopify_api_1 = require("@shopify/shopify-api");
var defaultFireStoreSessionStorageOptions = {
    sessionCollectionName: "shopify_sessions",
};
var FireStoreSessionStorage = /** @class */ (function () {
    function FireStoreSessionStorage(_cert, opts) {
        if (opts === void 0) { opts = {}; }
        this.options = __assign(__assign({}, defaultFireStoreSessionStorageOptions), opts);
        this.certificate = _cert;
        this.ready = this.init();
    }
    FireStoreSessionStorage.prototype.storeSession = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        data = {};
                        session.toPropertyArray().forEach(function (val) {
                            data[val[0]] = val[1];
                        });
                        this.sessionID = session.id;
                        return [4 /*yield*/, this.sessionRef
                                .get()
                                .then(function (sessionSnapshot) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!sessionSnapshot.exists) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.sessionRef.update(data)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                        case 2: return [4 /*yield*/, this.sessionRef.set(data)];
                                        case 3: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.writeTime ? true : false];
                }
            });
        });
    };
    FireStoreSessionStorage.prototype.loadSession = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        data = [];
                        this.sessionID = id;
                        for (key in this.sessionRef) {
                            data.push([key, this.sessionRef[key]]);
                        }
                        return [2 /*return*/, this.sessionRef ? shopify_api_1.Session.fromPropertyArray(data) : undefined];
                }
            });
        });
    };
    FireStoreSessionStorage.prototype.deleteSession = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        this.sessionID = id;
                        return [4 /*yield*/, this.sessionRef.delete()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    FireStoreSessionStorage.prototype.deleteSessions = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        ids.forEach(function (id) {
                            _this.deleteSession(id);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    };
    FireStoreSessionStorage.prototype.findSessionsByShop = function (shop) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        results = this.collection.where("shop", "==", shop).get();
                        return [2 /*return*/, results.then(function (snapshots) { return __awaiter(_this, void 0, void 0, function () {
                                var sessions;
                                return __generator(this, function (_a) {
                                    sessions = [];
                                    if (snapshots.size > 0) {
                                        snapshots.forEach(function (docSnapshot) {
                                            var data = [];
                                            for (var key in docSnapshot) {
                                                data.push([key, docSnapshot.get(key)]);
                                            }
                                            sessions.push(shopify_api_1.Session.fromPropertyArray(data));
                                        });
                                    }
                                    return [2 /*return*/, sessions];
                                });
                            }); })];
                }
            });
        });
    };
    Object.defineProperty(FireStoreSessionStorage.prototype, "collection", {
        get: function () {
            return this.client.collection(this.options.sessionCollectionName);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FireStoreSessionStorage.prototype, "sessionRef", {
        get: function () {
            return this.collection.doc(this.sessionID);
        },
        enumerable: false,
        configurable: true
    });
    FireStoreSessionStorage.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, app_1.initializeApp)({
                    credential: (0, app_1.cert)(this.certificate),
                });
                this.client = (0, firestore_1.getFirestore)();
                return [2 /*return*/];
            });
        });
    };
    return FireStoreSessionStorage;
}());
exports.default = FireStoreSessionStorage;
//# sourceMappingURL=index.js.map