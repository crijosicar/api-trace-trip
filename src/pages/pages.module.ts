import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Page, PageSchema } from './model/page.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  providers: [PagesService],
  exports: [PagesService],
  controllers: [PagesController],
})
export class PagesModule {}
