import { Injectable } from '@nestjs/common';
import { User } from './model/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { updateConfiguration } from 'src/shared/mongosee.config';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdateAvatarUserDto } from './dto/update-avatar-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async find(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto | UpdatePasswordUserDto | UpdateAvatarUserDto,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
      updateConfiguration,
    );
  }
}
