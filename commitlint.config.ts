import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (message: string) =>
      message.startsWith('chore: bump') || message.startsWith('Updating'),
  ],
};

export default Configuration;
