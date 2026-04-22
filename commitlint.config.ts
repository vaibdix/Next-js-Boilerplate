// @ts-expect-error -- @commitlint/types is resolved by commitlint at runtime
import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (message: string) =>
      message.startsWith('chore: bump') || message.startsWith('Updating'),
  ], // Ignore dependabot commits
};

export default Configuration;
