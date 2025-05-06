"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
// Your Express app
const index_1 = __importDefault(require("./index")); // Ensure you import your app
describe("Image Processing API", () => {
    it("should upload an image", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default)
            .post("/upload")
            .attach("image", path_1.default.join(__dirname, "test-image.jpg")); // Ensure you use a real test image path
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Image uploaded");
        expect(res.body).toHaveProperty("filename");
    }));
    it("should convert an image", () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = "uploaded-file-name"; // Replace with actual filename after upload
        const res = yield (0, supertest_1.default)(index_1.default)
            .post("/convert")
            .send({ filename });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Image converted");
        expect(res.body).toHaveProperty("convertedPath");
    }));
    it("should return the list of uploaded images", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get("/images");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0); // Ensure there are images
    }));
    it("should download a converted image", () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = "converted-file-name"; // Replace with a converted file name
        const res = yield (0, supertest_1.default)(index_1.default).get(`/download/${filename}`);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/image/);
    }));
    it("should return 404 for non-existing image", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get("/download/non-existing-image");
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Converted image not found");
    }));
});
