#include <stdio.h>
#include <regex>
#include <iostream>
#include <emscripten.h>
#include <emscripten/bind.h >

using namespace emscripten;

struct MatchPayload
{
    int groupsLength;
    std::string groupsIndexes;
};

MatchPayload getMatch(const std::string &text, const std::string &regexp, const std::string &flags)
{
    MatchPayload result;

    result.groupsLength = 0;

    std::regex rgx(regexp);
    std::smatch matches;

    if (std::regex_search(text, matches, rgx))
    {
        for (size_t i = 1; i < matches.size(); ++i)
        {
            result.groupsLength++;
            result.groupsIndexes += std::to_string(matches.position(i)) + ":" + std::to_string(matches.str(i).length()) + ",";
        }
    }
    else
    {
        throw std::runtime_error("Match didn't find");
    }

    return result;
}

extern "C"
{
    EMSCRIPTEN_BINDINGS(my_class_example)
    {
        value_object<MatchPayload>("MatchPayload")
            .field("groupsLength", &MatchPayload::groupsLength)
            .field("groupsIndexes", &MatchPayload::groupsIndexes);

        function("getMatch", &getMatch);
    }
}
