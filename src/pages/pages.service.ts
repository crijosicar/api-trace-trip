import { Injectable } from '@nestjs/common';
import { Page } from './model/page.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { updateConfiguration } from 'src/shared/mongosee.config';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(@InjectModel(Page.name) private pageModel: Model<Page>) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    const createdPage = new this.pageModel(createPageDto);
    return createdPage.save();
  }

  async findAll(): Promise<Page[]> {
    return this.pageModel.find().exec();
  }

  async find(id: string): Promise<Page | undefined> {
    return this.pageModel.findById(id);
  }

  async findOne(name: string): Promise<Page | undefined> {
    return this.pageModel.findOne({ name });
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    return this.pageModel.findOneAndUpdate(
      { _id: id },
      updatePageDto,
      updateConfiguration,
    );
  }
}
