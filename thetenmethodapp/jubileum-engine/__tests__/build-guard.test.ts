import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

function commands(env: Record<string, string>) {
  const calls: string[] = [];
  const source = fs.readFileSync(path.join(__dirname, '../scripts/build.js'), 'utf8');
  vm.runInNewContext(source, {
    process: { env }, console: { log: () => undefined },
    require: (name: string) => name === 'dotenv' ? { config: () => undefined } : { execSync: (command: string) => calls.push(command) }
  });
  return calls;
}

test('a Vercel preview never migrates, even when CI and database URL are present', () => {
  expect(commands({ VERCEL: '1', VERCEL_ENV: 'preview', CI: 'true', DATABASE_URL: 'postgresql://test.invalid/db' })).toEqual(['npx prisma generate', 'next build']);
  expect(commands({ VERCEL: '1', CI: 'true', DATABASE_URL: 'postgresql://test.invalid/db' })).not.toContain('npx prisma migrate deploy');
});

test('production retains its migration behavior; local builds stay read-only', () => {
  expect(commands({ VERCEL: '1', VERCEL_ENV: 'production', DATABASE_URL: 'postgresql://test.invalid/db' })).toContain('npx prisma migrate deploy');
  expect(commands({ DATABASE_URL: 'postgresql://test.invalid/db' })).not.toContain('npx prisma migrate deploy');
});
