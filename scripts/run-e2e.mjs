import { spawn } from 'node:child_process';

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

try {
  await import('@playwright/test');
} catch (error) {
  console.error('Playwright is not installed. Install @playwright/test and browser binaries, then rerun npm run test:e2e.');
  console.error(error?.message ?? error);
  process.exit(1);
}

const buildCode = await run('npm', ['run', 'build']);
if (buildCode !== 0) process.exit(buildCode);
process.exit(await run('npx', ['playwright', 'test']));
