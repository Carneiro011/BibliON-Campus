"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const resources_module_1 = require("./resources/resources.module");
const search_module_1 = require("./search/search.module");
const ratings_module_1 = require("./ratings/ratings.module");
const comments_module_1 = require("./comments/comments.module");
const moderation_module_1 = require("./moderation/moderation.module");
const ai_module_1 = require("./ai/ai.module");
const storage_module_1 = require("./storage/storage.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            resources_module_1.ResourcesModule,
            search_module_1.SearchModule,
            ratings_module_1.RatingsModule,
            comments_module_1.CommentsModule,
            moderation_module_1.ModerationModule,
            ai_module_1.AiModule,
            storage_module_1.StorageModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map