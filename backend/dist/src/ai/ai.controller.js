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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
class AnalyzeDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['pdf', 'link']),
    __metadata("design:type", String)
], AnalyzeDto.prototype, "type", void 0);
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async analyze(dto) {
        return this.aiService.analyzeResource(dto);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Analisar material e gerar resumo + tags com IA' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyzeDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "analyze", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('ai'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map