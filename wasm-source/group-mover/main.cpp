#include <iterator>
#include <string>
#include <regex>
#include <stdio.h>
#include <emscripten.h>
#include <emscripten/bind.h >

using namespace emscripten;

struct MatchGroup
{
    std::string text;
    int index;
};

struct Match
{
    std::string text;
    int index;
    int groupsLength;
    std::vector<MatchGroup> groups;
};

extern "C"
{
    Match getMatch(const std::string &text, const std::string &regex, const std::string &flags)
    {
        Match match;

        std::regex r(regex);
        for (std::sregex_iterator i = std::sregex_iterator(text.begin(), text.end(), r);
             i != std::sregex_iterator();
             ++i)
        {
            std::smatch m = *i;

            match.text = m.str();
            match.index = m.position(0);
            match.groups.resize(m.size());
            match.groupsLength = m.size();

            for (int i = 0; i < m.size(); i++)
            {
                match.groups[i].text = m.str(i);
                match.groups[i].index = m.position(i);
            }
        }

        return match;
    }

    MatchGroup extractMatchGroup(const std::vector<MatchGroup> &groups, const int &index)
    {
        return groups[index];
    }

    EMSCRIPTEN_BINDINGS(my_class_example)
    {

        value_object<Match>("Match")
            .field("text", &Match::text)
            .field("index", &Match::index)
            .field("groupsLength", &Match::groupsLength)
            .field("groups", &Match::groups);

        value_object<MatchGroup>("MatchGroup")
            .field("text", &MatchGroup::text)
            .field("index", &MatchGroup::index);

        register_vector<MatchGroup>("VectorInt");

        function("getMatch", &getMatch);
        function("extractMatchGroup", &extractMatchGroup);
    }
}
