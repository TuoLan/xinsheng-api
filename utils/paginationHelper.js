// paginationHelper.js
async function paginate(model, page = 1, pageSize = 10, query = {}, sort = {}) {
  // 计算需要跳过的条目数
  const skip = (page - 1) * pageSize;

  try {
    // 查询数据，跳过指定数量的条目，并限制返回条目数
    const data = await model.find(query).sort(sort).skip(skip).limit(pageSize);

    // 获取符合查询条件的数据总数
    const total = await model.countDocuments(query);

    // 返回分页数据
    return {
      data,
      total,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = paginate;
