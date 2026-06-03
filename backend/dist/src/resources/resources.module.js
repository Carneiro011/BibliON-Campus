"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const resources_controller_1 = require("./resources.controller");
const resources_service_1 = require("./resources.service");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_module_1 = require("../ai/ai.module");
const storage_module_1 = require("../storage/storage.module");
let ResourcesModule = class ResourcesModule {
};
exports.ResourcesModule = ResourcesModule;
exports.ResourcesModule = ResourcesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({ storage: (0, multer_1.memoryStorage)() }),
            prisma_module_1.PrismaModule,
            ai_module_1.AiModule,
            storage_module_1.StorageModule,
        ],
        controllers: [resources_controller_1.ResourcesController],
        providers: [resources_service_1.ResourcesService],
        exports: [resources_service_1.ResourcesService],
    })
], ResourcesModule);
//# sourceMappingURL=resources.module.js.map