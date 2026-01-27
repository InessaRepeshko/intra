import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/modules/identity/application/users.service';
import { UsersRepository } from '../../src/modules/identity/infrastructure/prisma-repositories/users.repository';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: UsersRepository,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findById: jest.fn(),
                        findByEmail: jest.fn(),
                        updateById: jest.fn(),
                        deleteById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
