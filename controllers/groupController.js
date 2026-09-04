const GroupService = require('../services/groupService');
const catchAsync = require('../utils/catchAsync');

exports.createGroup = catchAsync(async (req, res) => {
  const result = await GroupService.createGroup(req.user._id, req.body);
  res.status(201).json({
    success: true,
    msg: "Ekub Group Created!",
    data: result
  });
});

exports.joinGroup = catchAsync(async (req, res) => {
  const group = await GroupService.joinGroup(req.user._id, req.body.inviteCode);
  res.status(200).json({ success: true, msg: "Successfully joined the Ekub!", data: group });
});

exports.getGroupDetails = catchAsync(async (req, res) => {
  const group = await GroupService.getGroupDetails(req.params.id);
  res.status(200).json({ success: true, data: group });
});

exports.getMyGroups = catchAsync(async (req, res) => {
  const groups = await GroupService.getMyGroups(req.user._id);
  res.status(200).json({ success: true, count: groups.length, data: groups });
});

exports.getWinnerHistory = catchAsync(async (req, res) => {
  const history = await GroupService.getWinnerHistory(req.params.groupId);
  res.status(200).json({ success: true, data: history });
});

exports.getMyWinningHistory = catchAsync(async (req, res) => {
  const myWins = await GroupService.getMyWinningHistory(req.user._id);
  res.status(200).json({ success: true, data: myWins });
});
