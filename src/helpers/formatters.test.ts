import {fmtAi, fmtError, fmtSuccess, fmtWarning, truncate} from './formatters';

describe('fmtError function', () => {
  it('correctly formats messages', () => {
    expect(fmtError('Error occurred')).toEqual( '❌ Error occurred');
  });
});

describe('fmtWarning function', () => {
    it('correctly formats messages', () => {
        expect(fmtWarning('Warning occurred')).toEqual( '⚠️ Warning occurred');
    });
});

describe('fmtSuccess function', () => {
    it('correctly formats messages', () => {
        expect(fmtSuccess('Success occurred')).toEqual( '✅ Success occurred');
    });
});

describe('fmtAi function', () => {
    it('correctly formats messages', () => {
        expect(fmtAi('Eat some glue'))
            .toEqual( '🤖 __**This content is AI-Generated**__ 🤖\n\nEat some glue');
    });
});

describe('truncate function', () => {
    it('should return the original string if it contains 2000 characters or less', () => {
        const text = 'A'.repeat(2000);
        const result = truncate(text);

        expect(result).toEqual(text);
    });

    it('should return a truncated string if it contains more than 2000 characters', () => {
        const text = 'A'.repeat(2025);
        const result = truncate(text);

        expect(result).toEqual('A'.repeat(2000));
    });
});
