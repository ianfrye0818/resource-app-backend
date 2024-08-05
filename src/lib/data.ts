export const getPrompt = (cleanedDocument: string) => {
  return `
does the document below look like it's a resume, if not - please return only the text 'not a resume';
otherwise,
if it is a resume, can you please parse it into a json object with the following format do not include any special characters or formatting:
    {
      name: string;
      summary: string;
      skills: string[];
      education: { school: string; degree: string }[];
      workHistory: {
        company: string;
        startDate: string;
        endDate: string;
        title: string;
        duties: string[];
      }[];
    }


Please clean up any grammatical errors and ensure that the resume and summary sound professional.
${cleanedDocument}
`;
};

export const MAX_REQUESTS_PER_MIN = 10;
export const MAX_REQUESTS_PER_DAY = 1000;

export const ErrorMessages = {
  DailyRateLimit: 'Daily rate limit exceeded',
  NotResume: 'Not a resume!',
  RateLimit: 'Rate limit exceeded',
  MinuteRateLimit: 'Rate limit exceeded',
  Unknown: 'An unknown error occurred',
  InvalidResume: 'Invalid Resume or Filetype',
  NoFile: 'No file provided',
  InvalidModel: 'Invalid AI Model Type',
  InvalidFileType:
    'Invalid file type. Only PDF, DOCX, and DOC files are allowed.',
};
