import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>){

  }
  async create(createCategoryDto: CreateCategoryDto):Promise<Category>{
    const category: Category = {...createCategoryDto, id:undefined}
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Array<Category>> {
    return this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: {
        id
      }
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category: Category = {
      id: updateCategoryDto.id,
      name: updateCategoryDto.name,
      salesForceId: updateCategoryDto.salesForceId
    }
    return this.categoryRepository.update(id, category);
  }

  remove(id: string) {
    return this.categoryRepository.delete({id});
  }
}
