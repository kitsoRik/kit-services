#include "char-size.cpp"
#include "groups.cpp"
#include "lines.cpp"

struct Position
{
    float x;
    float y;
    float w;
    float h;
};

struct RenderPosition
{
    float x;
    float y;
    float w;
    float h;

    std::vector<RenderGroupPosition> groups;
};

Position renderPosition(const std::string &match,
                        const int &column,
                        const int &row,
                        const std::string &textBefore)
{
    auto w = getStringWidth(match);
    auto h = getLineHeight();

    auto x = getStringWidth(textBefore);
    auto y = row * getCharHeight();

    Position position;

    position.x = x;
    position.y = y;
    position.w = w;
    position.h = h;

    return result;
};

void renderPositions = async(
    const std::string &text,
    const int matcher,
    const std::vector<LineInfo> lines)
{
    auto lineNumber = 0;
    auto lettersSkiped = 0;

    auto lastTextMatchIndex = -1;

    auto match = matcher.getNextMatch();
    auto lastMatch : RegExpMatchArray = null;
    auto index = 0;
    
    while (match)
    {
        const matchText = match[0];
        const textMatchIndex = text.indexOf(
            matchText,
            lastMatch
                ? lastMatch.index + lastMatch.length
                : match
                      ? match.index
                      : undefined);

        lastTextMatchIndex = textMatchIndex;

        while (lettersSkiped <= textMatchIndex)
        {
            lineNumber++;
            lettersSkiped += lines[lineNumber].length;
        }
        lettersSkiped -= lines[lineNumber] ?.length ? ? 0;

        const row = lineNumber - 1;
        let column;
        column = text.indexOf(
			matchText,
			lastMatch?.index + lastMatch?.[0].length ?? 0
		);

        const renderPositionItem = renderPosition(
            matchText,
            column,
            row,
            lines[lineNumber].value.slice(0, column));

        callback(
            {
                ... renderPositionItem,
                groups : renderGroups(
                    match,
                    renderPositionItem.x,
                    renderPositionItem.y,
                    row),
            },
            index++);

        lineNumber = 0;
        lettersSkiped = 0;

        lastMatch = match;
        match = matcher.getNextMatch();
        if (index % 1000 == = 0)
            await delay(1);
    }
};

export const delay = async(timeout
                           : number) = >
                                       new Promise((r) = > setTimeout(r, timeout));
