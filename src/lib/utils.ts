import { User } from '@prisma/client';
import { ClientUser, ParsedJson } from './types.';
import { ErrorMessages } from './data';

export function capitalizeWords(str: string) {
  const words = str.split(' ');
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function generateClientSideUserProperties(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}

export function getDisplayName(user: ClientUser, isAnonymous?: boolean) {
  return isAnonymous
    ? 'Someone Special'
    : `${user.firstName} ${user.lastName[0]}`;
}

export function checkIfValidresume(parsedJson: ParsedJson) {
  if (
    !parsedJson.name ||
    !parsedJson.summary ||
    !parsedJson.skills ||
    !parsedJson.education ||
    !parsedJson.workHistory
  ) {
    throw new Error(ErrorMessages.NotResume);
  }
}

export function getFormattedDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear().toString().slice(-2);

  return `${month}/${day}/${year}`;
}

export function cleanJsonString(jsonString: string) {
  return jsonString.replace(/```json|```/g, '');
}

export function convertBoolean(value: any) {
  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue === 'true') return true;
    if (normalizedValue === 'false') return false;
  }

  return value;
}
