// src/storage/storage.service.ts
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)
  private supabase: SupabaseClient

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      config.get('SUPABASE_URL')!,
      config.get('SUPABASE_SERVICE_KEY')!,
    )
    this.logger.log('Supabase Storage inicializado')
  }

  async uploadPdf(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ url: string; path: string }> {
    const filename = `${userId}/${uuidv4()}.pdf`

    const { error } = await this.supabase.storage
      .from('pdfs')
      .upload(filename, file.buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (error) throw new Error(`Erro no upload: ${error.message}`)

    // Gerar URL pública
    const { data } = this.supabase.storage
      .from('pdfs')
      .getPublicUrl(filename)

    this.logger.log(`PDF enviado: ${filename}`)
    return { url: data.publicUrl, path: filename }
  }

  async deleteFile(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from('pdfs')
      .remove([path])

    if (error) this.logger.warn(`Erro ao deletar: ${error.message}`)
  }
}
