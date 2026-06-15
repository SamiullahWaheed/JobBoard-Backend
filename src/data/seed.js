const Admin = require("../models/Admin");
const Job = require("../models/Job");
const FeaturedJob = require("../models/FeaturedJob");
const { hashPassword } = require("../utils/password");
const { uploadRemoteJobImage } = require("../config/cloudinary");

const starterJobs = [
  {
    title: "Senior Full Stack Engineer",
    company: "Orbit Software Labs",
    location: "Islamabad",
    category: "IT / Tech",
    type: "private",
    vacancies: 3,
    deadline: "2026-10-15",
    experience: "4+ years building production web applications",
    jobType: "full-time",
    requirements: [
      "Strong React, Node.js, and TypeScript experience",
      "Experience designing REST APIs and MongoDB data models",
      "Comfortable with testing, code reviews, and CI/CD workflows",
    ],
    applyUrl: "https://www.linkedin.com/jobs/",
    imageSource:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    description:
      "Build reliable web products across the frontend and backend, collaborate with product designers, and help improve engineering standards across the team.",
  },
  {
    title: "Primary School Teacher",
    company: "National Learning Academy",
    location: "Lahore",
    category: "Teacher",
    type: "private",
    vacancies: 12,
    deadline: "2026-09-30",
    experience: "2+ years of classroom teaching preferred",
    jobType: "full-time",
    requirements: [
      "Bachelor's degree and a recognized teaching qualification",
      "Strong classroom management and lesson-planning skills",
      "Clear communication with students, parents, and colleagues",
    ],
    applyUrl: "https://www.linkedin.com/jobs/",
    imageSource:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    description:
      "Plan and deliver engaging primary-level lessons, assess student progress, maintain learning records, and contribute to a supportive school community.",
  },
  {
    title: "Hospital Operations Coordinator",
    company: "CarePoint Medical Centre",
    location: "Karachi",
    category: "Healthcare",
    type: "private",
    vacancies: 4,
    deadline: "2026-10-25",
    experience: "3+ years in healthcare operations or administration",
    jobType: "contract",
    requirements: [
      "Experience coordinating clinical or hospital operations",
      "Working knowledge of patient-service and compliance procedures",
      "Strong scheduling, reporting, and stakeholder-management skills",
    ],
    applyUrl: "https://www.linkedin.com/jobs/",
    imageSource:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=85",
    description:
      "Coordinate patient services, staff schedules, operational reporting, and compliance records to support efficient day-to-day hospital delivery.",
  },
  {
    title: "Finance and Accounts Officer",
    company: "Federal Development Services",
    location: "Rawalpindi",
    category: "Finance",
    type: "government",
    vacancies: 6,
    deadline: "2026-11-05",
    experience: "2+ years in accounting, audit, or financial reporting",
    jobType: "full-time",
    requirements: [
      "Degree in accounting, finance, commerce, or a related discipline",
      "Experience with reconciliations, ledgers, and monthly reporting",
      "Strong spreadsheet and financial-control skills",
    ],
    applyUrl: "https://www.njp.gov.pk/",
    imageSource:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=85",
    description:
      "Maintain financial records, prepare reconciliations and management reports, support audits, and ensure compliance with internal controls.",
  },
  {
    title: "Civil Site Engineer",
    company: "CivicBuild Engineering",
    location: "Peshawar",
    category: "Engineering",
    type: "private",
    vacancies: 5,
    deadline: "2026-10-20",
    experience: "3+ years of construction-site supervision",
    jobType: "full-time",
    requirements: [
      "Bachelor's degree in civil engineering",
      "Experience supervising contractors, quality, and site safety",
      "Ability to read drawings and prepare progress reports",
    ],
    applyUrl: "https://www.linkedin.com/jobs/",
    imageSource:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85",
    description:
      "Supervise construction activities, coordinate contractors, monitor quality and safety, and report progress against approved plans and schedules.",
  },
  {
    title: "Administrative Services Officer",
    company: "Public Services Directorate",
    location: "Quetta",
    category: "Administration",
    type: "government",
    vacancies: 8,
    deadline: "2026-11-15",
    experience: "1-3 years in office administration",
    jobType: "full-time",
    requirements: [
      "Bachelor's degree in business, public administration, or a related field",
      "Strong record-keeping, correspondence, and scheduling skills",
      "Proficiency with standard office productivity tools",
    ],
    applyUrl: "https://www.njp.gov.pk/",
    imageSource:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85",
    description:
      "Support departmental operations, organize records and meetings, coordinate official correspondence, and assist teams with administrative services.",
  },
  {
    title: "Product UI Designer",
    company: "PixelCraft Studio",
    location: "Remote",
    category: "Design",
    type: "private",
    vacancies: 2,
    deadline: "2026-10-10",
    experience: "3+ years designing web or mobile products",
    jobType: "full-time",
    requirements: [
      "Strong portfolio demonstrating product and interaction design",
      "Proficiency with Figma and reusable design systems",
      "Understanding of responsive and accessible interface design",
    ],
    applyUrl: "https://www.linkedin.com/jobs/",
    imageSource:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    description:
      "Turn product requirements into polished user flows, responsive interfaces, and reusable design-system components in close partnership with engineering.",
  },
  {
    title: "Data Entry and Records Assistant",
    company: "Citizen Support Office",
    location: "Multan",
    category: "Others",
    type: "government",
    vacancies: 15,
    deadline: "2026-09-25",
    experience: "Entry level; relevant office experience is preferred",
    jobType: "contract",
    requirements: [
      "Intermediate education or higher",
      "Accurate typing and data-entry skills",
      "Ability to handle records confidentially and meet deadlines",
    ],
    applyUrl: "https://www.njp.gov.pk/",
    imageSource:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=85",
    description:
      "Enter and verify records, organize digital and physical files, prepare routine reports, and support the office with accurate information management.",
  },
];

async function addCloudinaryImage(job) {
  try {
    const result = await uploadRemoteJobImage(job.imageSource);
    return {
      ...job,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
    };
  } catch (error) {
    console.warn(`Seed image upload failed for "${job.title}": ${error.message}`);
    return { ...job, imageUrl: job.imageSource, imagePublicId: "" };
  }
}

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

  if ((await Job.countDocuments()) > 0) return;

  const jobsWithImages = [];
  for (const starterJob of starterJobs) {
    jobsWithImages.push(await addCloudinaryImage(starterJob));
  }

  const jobsToInsert = jobsWithImages.map(
    ({ featured: _featured, imageSource: _imageSource, ...job }) => job,
  );
  const insertedJobs = await Job.insertMany(jobsToInsert);
  const featuredJobs = insertedJobs
    .map((job, index) => ({ job, featured: starterJobs[index].featured }))
    .filter((item) => item.featured && item.job.deadline > new Date())
    .map((item) => ({ job: item.job._id, expiresAt: item.job.deadline }));

  if (featuredJobs.length) {
    await FeaturedJob.insertMany(featuredJobs);
  }

  console.log(
    `Seeded ${insertedJobs.length} jobs and ${featuredJobs.length} featured jobs`,
  );
}

module.exports = seedDatabase;
