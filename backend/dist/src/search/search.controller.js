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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    search(q, type, disciplineId, page, limit) {
        return this.searchService.search({ q, type, disciplineId, page, limit });
    }
    searchTags(q) {
        return this.searchService.searchTags(q || '');
    }
    getDisciplines() {
        return this.searchService.getDisciplines();
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Busca full-text em recursos' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true, description: 'Termo de busca' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'disciplineId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('disciplineId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'Autocomplete de tags' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "searchTags", null);
__decorate([
    (0, common_1.Get)('disciplines'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar disciplinas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "getDisciplines", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map