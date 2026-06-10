const FeaturedJob = require("../models/FeaturedJob");

async function listFeaturedJobs(_req, res) {
  const featuredEntries = await FeaturedJob.find({ expiresAt: { $gt: new Date() } })
    .populate("job")
    .sort({ createdAt: -1 });

  const jobs = featuredEntries
    .filter((entry) => entry.job)
    .map((entry) => ({
      ...entry.job.toJSON(),
      featured: true,
      featuredUntil: entry.expiresAt.toISOString(),
    }));

  res.json({ jobs });
}

module.exports = { listFeaturedJobs };
