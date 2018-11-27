// manual merge stats
const mergeStats = (a, b) => {
  const stats = {
    count: a.count + b.count,
    duration: (a.duration + b.duration) / 2,
    status: Object.keys(a.status).reduce(
      (all, key) => ({
        ...all,
        [key]: {
          count: a.status[key].count + b.status[key].count,
          label: a.status[key].label
        }
      }),
      {}
    ),
    monthly: {},
    processing: {}
  };
  Object.keys(a.monthly).forEach(key => {
    if (!stats.monthly[key]) {
      stats.monthly[key] = {
        count: 0,
        duration: 0,
        status: Object.keys(a.status).reduce(
          (all, st) => ({
            ...all,
            [st]: {
              count: 0,
              label: a.monthly[key].status[st].label
            }
          }),
          {}
        )
      };
    }
    stats.monthly[key].count += a.monthly[key].count;
    stats.monthly[key].duration += a.monthly[key].duration;
    Object.keys(stats.monthly[key].status).forEach(st => {
      stats.monthly[key].status[st].count += a.monthly[key].status[st].count;
    });
  });
  Object.keys(b.monthly).forEach(key => {
    if (!stats.monthly[key]) {
      stats.monthly[key] = {
        count: 0,
        duration: 0,
        status: Object.keys(a.status).reduce(
          (all, st) => ({
            ...all,
            [st]: {
              count: 0,
              label: b.monthly[key].status[st].label
            }
          }),
          {}
        )
      };
    }
    stats.monthly[key].count += b.monthly[key].count;
    stats.monthly[key].duration += b.monthly[key].duration;
    Object.keys(stats.monthly[key].status).forEach(st => {
      stats.monthly[key].status[st].count += b.monthly[key].status[st].count;
    });
    stats.monthly[key].duration /= 2;
  });

  return stats;
};

export default mergeStats;
