const Job = require("../models/Job");
const FeaturedJob = require("../models/FeaturedJob");

const allowedFields = [
  "title",
  "description",
  "company",
  "location",
  "category",
  "type",
  "vacancies",
  "deadline",
  "experience",
  "jobType",
];

function pickJobFields(input) {
  return allowedFields.reduce((result, field) => {
    if (input[field] !== undefined) result[field] = input[field];
    return result;
  }, {});
}

async function syncFeaturedJob(job, shouldFeature) {
  if (shouldFeature && job.deadline > new Date()) {
    await FeaturedJob.findOneAndUpdate(
      { job: job._id },
      { expiresAt: job.deadline },
      { upsert: true, new: true, runValidators: true },
    );
    return;
  }

  await FeaturedJob.deleteOne({ job: job._id });
}

async function attachFeaturedState(jobs) {
  const jobIds = jobs.map((job) => job._id);
  const featuredEntries = await FeaturedJob.find({
    job: { $in: jobIds },
    expiresAt: { $gt: new Date() },
  }).lean();
  const featuredByJob = new Map(
    featuredEntries.map((entry) => [String(entry.job), entry.expiresAt]),
  );

  return jobs.map((job) => ({
    ...job.toJSON(),
    featured: featuredByJob.has(String(job._id)),
    featuredUntil: featuredByJob.get(String(job._id))?.toISOString(),
  }));
}

async function listJobs(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const filter = {};
  const query = String(req.query.q || "").trim();

  if (query) filter.$text = { $search: query };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.location) {
    filter.location = { $regex: String(req.query.location), $options: "i" };
  }

  const [jobDocuments, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Job.countDocuments(filter),
  ]);
  const jobs = await attachFeaturedState(jobDocuments);

  res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
}

async function getJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found." });
  const [serializedJob] = await attachFeaturedState([job]);
  res.json({ job: serializedJob });
}

async function createJob(req, res) {
  const job = await Job.create(pickJobFields(req.body));
  await syncFeaturedJob(job, req.body.featured === true);
  const [serializedJob] = await attachFeaturedState([job]);
  res.status(201).json({ job: serializedJob });
}

async function updateJob(req, res) {
  const job = await Job.findByIdAndUpdate(req.params.id, pickJobFields(req.body), {
    new: true,
    runValidators: true,
  });
  if (!job) return res.status(404).json({ message: "Job not found." });
  await syncFeaturedJob(job, req.body.featured === true);
  const [serializedJob] = await attachFeaturedState([job]);
  res.json({ job: serializedJob });
}

async function deleteJob(req, res) {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found." });
  await FeaturedJob.deleteOne({ job: job._id });
  res.json({ message: "Job deleted." });
}

module.exports = { listJobs, getJob, createJob, updateJob, deleteJob };
