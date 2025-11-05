import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from '../database/entities/user.entity';
import { UserRole } from '../database/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    passwordHash: 'hashedPassword123',
    role: UserRole.USER,
    createdAt: new Date('2024-01-01'),
    
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User)) as jest.Mocked<
      Repository<User>
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      // Arrange
      const userId = '123';
      repository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      // Arrange
      const userId = '123';
      const error = new Error('Database connection error');
      repository.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(service.findById(userId)).rejects.toThrow(error);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      // Arrange
      const email = 'test@example.com';
      repository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });

    it('should handle case-sensitive email search', async () => {
      // Arrange
      const email = 'Test@Example.Com';
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'Test@Example.Com' },
      });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      // Arrange
      const email = 'test@example.com';
      const error = new Error('Database connection error');
      repository.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(service.findByEmail(email)).rejects.toThrow(error);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData: Partial<User> = {
        email: 'newuser@example.com',
        passwordHash: 'hashedPassword',
        role: UserRole.USER,
      };
      const createdUser = {
        ...userData,
        id: '456',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      repository.create.mockReturnValue(createdUser);
      repository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(userData);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should create user with admin role', async () => {
      // Arrange
      const adminData: Partial<User> = {
        email: 'admin@example.com',
        passwordHash: 'hashedPassword',
        role: UserRole.ADMIN,
      };
      const createdAdmin = {
        ...adminData,
        id: '789',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      repository.create.mockReturnValue(createdAdmin);
      repository.save.mockResolvedValue(createdAdmin);

      // Act
      const result = await service.create(adminData);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(adminData);
      expect(repository.save).toHaveBeenCalledWith(createdAdmin);
      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('should handle repository save errors', async () => {
      // Arrange
      const userData: Partial<User> = {
        email: 'newuser@example.com',
        passwordHash: 'hashedPassword',
        role: UserRole.USER,
      };
      const createdUser = { ...userData, id: '456' } as User;
      const error = new Error('Database constraint violation');

      repository.create.mockReturnValue(createdUser);
      repository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(userData)).rejects.toThrow(error);
      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should preserve all provided user fields', async () => {
      // Arrange
      const userData: Partial<User> = {
        email: 'user@example.com',
        passwordHash: 'hash123',
        role: UserRole.USER,
      };
      const savedUser = {
        ...userData,
        id: 'generated-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      repository.create.mockReturnValue(savedUser);
      repository.save.mockResolvedValue(savedUser);

      // Act
      const result = await service.create(userData);

      // Assert
      expect(result.email).toBe(userData.email);
      expect(result.passwordHash).toBe(userData.passwordHash);
      expect(result.role).toBe(userData.role);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      
    });
  });
});
