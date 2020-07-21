import UserToken from '../infra/typeorm/entities/UserToken';

interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findUserByToken(token: string): Promise<UserToken | undefined>;
}

export default IUserTokensRepository;
