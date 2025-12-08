require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

module.exports = {
  siteUrl: "https://www.stillymathpro.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,

  // Exclude auth pages from sitemap
  exclude: [
    "/auth/*",
    "/dashboard",
    "/admin"
  ],

  additionalPaths: async (config) => {
    console.log("⏳ Generating free-worksheets sitemap...");

    const paths = [];

    // 0️⃣ Add main free-worksheets page
    paths.push({
      loc: "/worksheets/free-worksheets",
      changefreq: "daily",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    });

    // 1️⃣ Fetch courses
    const { data: courses, error: coursesErr } = await supabase
      .from("courses")
      .select("id, slug");

    if (coursesErr || !courses) {
      console.error("❌ Error fetching courses:", coursesErr);
      return paths;
    }

    // 2️⃣ Loop courses → fetch modules
    for (const course of courses) {
      // Course-level page
      paths.push({
        loc: `/worksheets/free-worksheets/${course.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });

      const { data: modules, error: modulesErr } = await supabase
        .from("sections")
        .select("id, slug, subsections(id, slug)")
        .eq("course_id", course.id);

      if (modulesErr || !modules) {
        console.error(`❌ Error fetching modules for course ${course.slug}:`, modulesErr);
        continue;
      }

      // 3️⃣ Loop modules → add subsections (skip module-level page)
      for (const module of modules) {
        if (!module.subsections || module.subsections.length === 0) continue;

        for (const sub of module.subsections) {
          // Subsection-level page
          const subPath = `/worksheets/free-worksheets/${course.slug}/${module.slug}/${sub.slug}`;
          paths.push({
            loc: subPath,
            changefreq: "weekly",
            priority: 0.6,
            lastmod: new Date().toISOString(),
          });

          // 4️⃣ Add printable-pdf setNumbers 1–5
          for (let setNumber = 1; setNumber <= 5; setNumber++) {
            const setPath = `/worksheets/free-worksheets/${course.slug}/${module.slug}/${sub.slug}/printable-pdf/${setNumber}`;
            paths.push({
              loc: setPath,
              changefreq: "weekly",
              priority: 0.5,
              lastmod: new Date().toISOString(),
            });
          }
        }
      }
    }

    console.log("🗺️ Total worksheet paths generated:", paths.length);
    return paths;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/*",
        ],
      },
    ],
  },
};