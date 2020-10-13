import { PatternType } from './pattern.type';

export const removeWikipeiaCallotNumbers: PatternType = {
	title: 'Wikipedia (remove callot)',
	functionCode: `
    const processedText = text.replace(/\[\d+\]/g, "");
    return processedText;
    `,
};
