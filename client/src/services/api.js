var twoSum = function (nums, target) {
  var arr = new Map();
  for (i = 0; i < nums.length; i++) {
    var targetVal = target - nums[i];
    if (arr.get(targetVal)) {
      return [arr.get(targetVal), i];
    }

    arr.set(nums[i], i);
  }
};
