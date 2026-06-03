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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const uuid_1 = require("uuid");
let StorageService = StorageService_1 = class StorageService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.supabase = (0, supabase_js_1.createClient)(config.get('SUPABASE_URL'), config.get('SUPABASE_SERVICE_KEY'));
        this.logger.log('Supabase Storage inicializado');
    }
    async uploadPdf(file, userId) {
        const filename = `${userId}/${(0, uuid_1.v4)()}.pdf`;
        const { error } = await this.supabase.storage
            .from('pdfs')
            .upload(filename, file.buffer, {
            contentType: 'application/pdf',
            upsert: false,
        });
        if (error)
            throw new Error(`Erro no upload: ${error.message}`);
        const { data } = this.supabase.storage
            .from('pdfs')
            .getPublicUrl(filename);
        this.logger.log(`PDF enviado: ${filename}`);
        return { url: data.publicUrl, path: filename };
    }
    async deleteFile(path) {
        const { error } = await this.supabase.storage
            .from('pdfs')
            .remove([path]);
        if (error)
            this.logger.warn(`Erro ao deletar: ${error.message}`);
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map