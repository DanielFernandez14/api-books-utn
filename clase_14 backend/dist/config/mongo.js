"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = void 0;
const mongoose_1 = require("mongoose");
process.loadEnvFile();
const URI_DB = process.env.URI_DB || "";
const connectMongoDB = async () => {
    try {
        await (0, mongoose_1.connect)(URI_DB);
        console.log("✅ Conectado con exito a MongoDB");
    }
    catch (error) {
        console.log("❌ No se pudo conectar a MongoDB");
    }
};
exports.connectMongoDB = connectMongoDB;
//# sourceMappingURL=mongo.js.map