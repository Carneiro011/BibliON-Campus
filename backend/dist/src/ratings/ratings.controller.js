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
exports.RatingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ratings_service_1 = require("./ratings.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
class RateDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], RateDto.prototype, "stars", void 0);
let RatingsController = class RatingsController {
    constructor(ratingsService) {
        this.ratingsService = ratingsService;
    }
    getForResource(resourceId) {
        return this.ratingsService.getForResource(resourceId);
    }
    upsert(resourceId, user, dto) {
        return this.ratingsService.upsert(user.id, resourceId, dto.stars);
    }
    myRating(resourceId, user) {
        return this.ratingsService.getUserRating(user.id, resourceId);
    }
};
exports.RatingsController = RatingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Média de avaliações do recurso' }),
    __param(0, (0, common_1.Param)('resourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "getForResource", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Avaliar recurso (upsert)' }),
    __param(0, (0, common_1.Param)('resourceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, RateDto]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "upsert", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Minha avaliação para este recurso' }),
    __param(0, (0, common_1.Param)('resourceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "myRating", null);
exports.RatingsController = RatingsController = __decorate([
    (0, swagger_1.ApiTags)('ratings'),
    (0, common_1.Controller)('resources/:resourceId/ratings'),
    __metadata("design:paramtypes", [ratings_service_1.RatingsService])
], RatingsController);
//# sourceMappingURL=ratings.controller.js.map