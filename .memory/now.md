# Current Focus

Fixed NodeArray assignment duplicate listener bug — `applyNodeArrayAssignment` now uses `splice` instead of `length=0`+`push` so kept items get listeners removed before re-adding.
