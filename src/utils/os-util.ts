import os from 'os';

const OS_MAP: Record<string, string> = {
  Linux: 'Linux',
  Darwin: 'MacOS',
  Windows_NT: 'Windows',
};

export function getOsAndShell() {
  const osType = OS_MAP[os.type()];
  const shellPath = process.env.SHELL || 'powershell.exe';
  const shellName = process.env.SHELL?.split('/').pop() || 'PowerShell';
  return {
    osType,
    shellPath,
    shellName,
  };
}
