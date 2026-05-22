// src/search/search.controller.ts
import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { SearchService } from './search.service'

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Busca full-text em recursos' })
  @ApiQuery({ name: 'q', required: true, description: 'Termo de busca' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'disciplineId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  search(
    @Query('q') q: string,
    @Query('type') type?: string,
    @Query('disciplineId') disciplineId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search({ q, type, disciplineId, page, limit })
  }

  @Get('tags')
  @ApiOperation({ summary: 'Autocomplete de tags' })
  searchTags(@Query('q') q: string) {
    return this.searchService.searchTags(q || '')
  }

  @Get('disciplines')
  @ApiOperation({ summary: 'Listar disciplinas' })
  getDisciplines() {
    return this.searchService.getDisciplines()
  }
}
