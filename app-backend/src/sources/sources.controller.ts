import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchSourceDto } from './dto/search-source.dto';
import { TagsService } from 'src/tags/tags.service';

@ApiTags('Source')
@Controller('sources')
export class SourcesController {
  constructor(
    private readonly sourcesService: SourcesService,
    private readonly tagsService: TagsService,
  ) {}

  @Post()
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(createSourceDto);
  }

  @Get()
  findByOffset(@Query() query: { offset: number; sortOrder: 'asc' | 'desc' }) {
    if (!query.offset) return this.sourcesService.findAll();
    const offset = query.offset;
    const sortOrder = query.sortOrder;
    return this.sourcesService.findByOffset(offset, sortOrder);
  }

  @Get('search')
  findByTitle(@Body() searchSourceDto: SearchSourceDto) {
    if (searchSourceDto.tags.length === 0) {
      return this.sourcesService.searchByTitle(searchSourceDto.title);
    }
    if (!searchSourceDto.title && searchSourceDto.tags.length === 1) {
      return this.tagsService.getSources(searchSourceDto.tags[0]);
    }
    if (!searchSourceDto.title) {
      return this.sourcesService.findSourcesByTags(searchSourceDto.tags);
    }
    return this.sourcesService.findSourcesByTagsAndTitle(
      searchSourceDto.tags,
      searchSourceDto.title,
    );
  }

  @Get(':id')
  findById(@Param('id') id: ObjectId) {
    return this.sourcesService.findById(id);
  }

  @Get('rating/:id')
  getRating(@Param('id') id: ObjectId) {
    return this.sourcesService.getRating(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourcesService.update(id, updateSourceDto);
  }

  @Patch('rating/:id')
  userRating(
    @Param('id') id: ObjectId,
    @Body('score') score: number,
    @Body('raterId') raterId: ObjectId,
  ) {
    return this.sourcesService.userRating(id, score, raterId as ObjectId);
  }

  @Patch('reset/:id')
  dataReset(@Param('id') id: ObjectId) {
    return this.sourcesService.dataReset(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.sourcesService.delete(id);
  }
}
