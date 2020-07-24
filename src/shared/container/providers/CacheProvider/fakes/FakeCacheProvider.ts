import ICacheProvider from '../models/ICacheProvider';

class FakeCacheProvider implements ICacheProvider {
  public async save(key: string, value: string): Promise<void> {
    // TODO
  }

  public async recover(key: string): Promise<string> {
    return 'ok';
  }

  public async invalidate(key: string): Promise<void> {
    // TODO
  }
}

export default FakeCacheProvider;
