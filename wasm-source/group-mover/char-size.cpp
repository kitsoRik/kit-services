#include <string>

const float CHAR_WIDTH = 7.33;
const float CHAR_HEIGHT = 15;

flaot getStringWidth(std::string str)
{
    float width = 0;

    for (int i = 0; i < str.size(); i++)
        width += getCharWidth(str[i]);

    return width;
};

float getCharWidth = (char c = '')
{
    if (c == '\t')
        return CHAR_WIDTH * 5;
    return CHAR_WIDTH;
};

float getCharHeight = (char c = ' ')
{
    return CHAR_HEIGHT;
};

float getLineHeight()
{
    return CHAR_HEIGHT;
};
