"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const moderation_service_1 = require("./moderation.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
class RejectDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectDto.prototype, "reason", void 0);
let ModerationController = class ModerationController {
    constructor(moderationService) {
        this.moderationService = moderationService;
    }
    getPending(page, limit) {
        return this.moderationService.getPending(Number(page) || 1, Number(limit) || 20);
    }
    getStats() {
        return this.moderationService.getStats();
    }
    approve(id, user) {
        return this.moderationService.approve(id, user.id);
    }
    reject(id, user, dto) {
        return this.moderationService.reject(id, user.id, dto.reason);
    }
    aiCheck(id) {
        return this.moderationService.aiPreModerate(id);
    }
};
exports.ModerationController = ModerationController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(client_1.Role.MODERATOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar recursos aguardando moderação' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ModerationController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.MODERATOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Estatísticas de moderação' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModerationController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.MODERATOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Aprovar recurso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ModerationController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)(client_1.Role.MODERATOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeitar recurso com motivo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, RejectDto]),
    __metadata("design:returntype", void 0)
], ModerationController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/ai-check'),
    (0, roles_decorator_1.Roles)(client_1.Role.MODERATOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Pré-moderação automática com IA' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModerationController.prototype, "aiCheck", null);
exports.ModerationController = ModerationController = __decorate([
    (0, swagger_1.ApiTags)('moderation'),
    (0, common_1.Controller)('moderation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [moderation_service_1.ModerationService])
], ModerationController);
//# sourceMappingURL=moderation.controller.js.map