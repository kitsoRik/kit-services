#include <vector>
#include <regex>

struct RenderGroupPosition {
	float x;
	float y;
	float w;
	float h;

	int groupIndex;
};

std::vector<RenderGroupPosition> renderGroups (
    const std::smatch &m,
	const float &offsetX,
	const float &offsetY,
	const int &row
) => {
    std::vector<RenderGroupPosition> groups;

	if (match.size() === 1) return groups;

	std::string text = match.str(0);
	auto lastIndex = -1;

	for (int i = 1; i < match.length; i++) {
		auto groupText = match.str(i)
        auto groupPosition = match.position(i);
		auto column = text.indexOf(group, lastIndex + 1);
        
		lastIndex += column;

		auto position = renderPosition(
			group,
			column,
			row,
			text.slice(0, column)
		);

		groups.push({
			x: offsetX + position.x,
			y: offsetY + position.y,
			w: position.w,
			h: position.h,

			groupIndex: i,
		});
	}

	return groups;
};
