import { Controller, Get, NotFoundError, Post, Res, UseBefore } from 'routing-controllers';
import { Example } from '../entities/example.entity';
import { getRepository } from 'typeorm';
import { CustomError } from '../common/utilities/CustomError';

@Controller('/users')
@UseBefore((req, res, next) => {
  console.log(req.body, '1');
  next();
})
export class UserController {
  @Get()
  async getAll() {
    const example = new Example();
    // example.field = 'example';
    // throw Error('custom error');
    // throw new NotFoundError();
    return await getRepository(Example).save(example);
  }

  @Post()
  @UseBefore((req, res, next) => {
    console.log('only for post');
    next();
  })
  post(@Res() response) {
    console.log('1');
    return response.status(200).json({
      message: 'success'
    });
  }
}
