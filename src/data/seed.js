const Admin = require("../models/Admin");
const Job = require("../models/Job");
const FeaturedJob = require("../models/FeaturedJob");
const { hashPassword } = require("../utils/password");

const starterJobs = [
  {
    title: "Senior Frontend Engineer",
    company: "Nexa Digital",
    location: "Islamabad",
    category: "IT / Tech",
    type: "private",
    vacancies: 3,
    deadline: "2026-08-15",
    experience: "4+ years building modern web applications",
    jobType: "full-time",
    featured: true,
    description:
      "Lead the development of accessible, high-performance product interfaces using React and modern frontend practices. Collaborate with design and backend teams to ship reliable customer experiences.",
  },
  {
    title: "Primary School Teacher",
    company: "Punjab Education Department",
    location: "Lahore",
    category: "Teacher",
    type: "government",
    vacancies: 28,
    deadline: "2026-09-01",
    experience: "2+ years teaching experience preferred",
    jobType: "full-time",
    featured: true,
    description:
      "Teach core subjects, maintain student records, prepare lesson plans, and coordinate with parents and school administration.",
  },
  {
    title: "Healthcare Administrator",
    company: "City Care Hospital",
    location: "Karachi",
    category: "Healthcare",
    type: "private",
    vacancies: 4,
    deadline: "2026-08-30",
    experience: "3+ years in healthcare administration",
    jobType: "contract",
    description:
      "Coordinate patient services, maintain compliance records, and support efficient day-to-day hospital operations.",
  },
  {
    title: "Accounts Officer",
    company: "National Finance Division",
    location: "Rawalpindi",
    category: "Finance",
    type: "government",
    vacancies: 6,
    deadline: "2026-08-22",
    experience: "2+ years in accounting and reporting",
    jobType: "full-time",
    description:
      "Handle ledgers, reconciliations, financial controls, and monthly reporting for cross-functional public sector teams.",
  },
  {
    title: "Civil Site Engineer",
    company: "Urban Build Partners",
    location: "Peshawar",
    category: "Engineering",
    type: "private",
    vacancies: 5,
    deadline: "2026-09-10",
    experience: "3+ years of site supervision",
    jobType: "full-time",
    description:
      "Supervise construction activities, coordinate contractors, enforce quality standards, and prepare progress reports.",
  },
  {
    title: "Administrative Coordinator",
    company: "Public Service Commission",
    location: "Quetta",
    category: "Administration",
    type: "government",
    vacancies: 8,
    deadline: "2026-09-05",
    experience: "1-2 years in office administration",
    jobType: "full-time",
    description:
      "Support office operations, organize records and schedules, coordinate correspondence, and assist departmental teams.",
  },
];

async function seedDatabase() {
  const email = (process.env.ADMIN_EMAIL || "admin@jobalert.com").toLowerCase();
  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Portal Administrator",
      email,
      passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || "admin123"),
    });
    console.log(`Seeded admin user: ${email}`);
  }

  if ((await Job.countDocuments()) === 0) {
    const jobsToInsert = starterJobs.map(({ featured: _featured, ...job }) => job);
    const insertedJobs = await Job.insertMany(jobsToInsert);
    const featuredJobs = insertedJobs
      .map((job, index) => ({ job, featured: starterJobs[index].featured }))
      .filter((item) => item.featured && item.job.deadline > new Date())
      .map((item) => ({ job: item.job._id, expiresAt: item.job.deadline }));

    if (featuredJobs.length) {
      await FeaturedJob.insertMany(featuredJobs);
    }
    console.log(`Seeded ${starterJobs.length} starter jobs`);
  }

  const legacyFeaturedJobs = await Job.find({
    featured: true,
    deadline: { $gt: new Date() },
  }).select("_id deadline");
  if (legacyFeaturedJobs.length) {
    await FeaturedJob.bulkWrite(
      legacyFeaturedJobs.map((job) => ({
        updateOne: {
          filter: { job: job._id },
          update: { $set: { expiresAt: job.deadline } },
          upsert: true,
        },
      })),
    );
  }
}

module.exports = seedDatabase;
