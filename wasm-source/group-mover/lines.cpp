#include <string>
#include <vector>
#include <stdio.h>

struct LineInfo
{
    std::string value;
    int startIndex;
    int length;
};

LineInfo calculateLineInfo(const std::string &text, const int &lineNumber, const std::vector<LineInfo> &currentLines)
{
    if (lineNumber == 1)
    {
        std::printf("q1");
        int index = 0;
        while (text[index] != '\n' && text[index])
        {
            index++;
        }
        std::printf("q2");

        auto slice = text.substr(0, index + 1);

        LineInfo lineInfo;

        lineInfo.value = slice;
        lineInfo.startIndex = 0;
        lineInfo.length = slice.length();

        return lineInfo;
    }
    else
    {
        std::printf("q3");
        auto prevLine = currentLines[lineNumber - 1];

        auto offset = prevLine.startIndex + prevLine.length;
        auto index = offset;

        while (text[index] != '\n' && text[index])
        {
            index++;
        }

        std::printf("q4");
        auto slice = text.substr(offset, (index - offset) + 1);

        if (slice.length() == 0)
        {
            throw std::runtime_error("");
        }
        std::printf("%d", slice.length());

        LineInfo lineInfo;

        lineInfo.value = slice;
        lineInfo.startIndex = offset;
        lineInfo.length = slice.length();

        return lineInfo;
    }
}

int getLines(const std::string &text)
{
    std::vector<LineInfo> *lineInfos = new std::vector<LineInfo>;

    try
    {
        do
        {
            auto lineInfo = calculateLineInfo(text, lineInfos->size() + 1, *lineInfos);
            lineInfos->push_back(lineInfo);
        } while (true);
    }
    catch (const std::exception &e)
    {
    }
    return reinterpret_cast<int>(&lineInfos);
}