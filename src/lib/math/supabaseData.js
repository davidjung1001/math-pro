// lib/math/supabaseData.js
import { supabase } from '../supabaseClient';
import { createClient } from '@supabase/supabase-js'

/** Fetches all modules (sections) + subsections + questions for /practice */
export async function fetchModules() {
  const { data, error } = await supabase
    .from('sections')
    .select(`
      id,
      section_title,
      course_id,
      subsections (
        id,
        subsection_title,
        lesson_content,
        questions (
          id,
          question_text,
          set_number,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option
        )
      )
    `)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching modules data:', error);
    return [];
  }

  return data.map(section => ({
    id: section.id.toString(),
    title: section.section_title,
    courseId: section.course_id,
    subsections: (section.subsections || []).map(sub => {
      const setsMap = {};
      (sub.questions || []).forEach(q => {
        const setNum = q.set_number ?? 1;
        if (!setsMap[setNum]) setsMap[setNum] = [];
        setsMap[setNum].push(q);
      });

      const practiceSets = Object.entries(setsMap).map(([num, questions]) => ({
        name: `Set${num}`,
        questions
      }));

      return {
        id: sub.id.toString(),
        moduleId: section.id.toString(),
        title: sub.subsection_title,
        description: `${sub.questions?.length || 0} questions`,
        lessonContent: sub.lesson_content ?? '',
        practiceSets
      };
    })
  }));
}

/** Fetches a single lesson/subsection by IDs */
export async function fetchSectionData(moduleId, sectionId) {
  const { data, error } = await supabase
    .from('subsections')
    .select(`
      id,
      subsection_title,
      lesson_content,
      sections!inner(id, course_id),
      questions (
        id,
        question_text,
        set_number,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option
      )
    `)
    .eq('id', sectionId)
    .eq('section_id', moduleId)
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error fetching section data:', error);
    return null;
  }

  const sub = data[0];
  const setsMap = {};
  (sub.questions || []).forEach(q => {
    const setNum = q.set_number ?? 1;
    if (!setsMap[setNum]) setsMap[setNum] = [];
    setsMap[setNum].push(q);
  });

  const practiceSets = Object.entries(setsMap).map(([num, questions]) => ({
    name: `Set${num}`,
    questions
  }));

  return {
    moduleId: sub.sections.id.toString(),
    courseId: sub.sections.course_id,
    id: sub.id.toString(),
    title: sub.subsection_title,
    lessonContent: sub.lesson_content ?? '',
    practiceSets
  };
}

/** Fetches one full course (slug-based) with sections + subsections + questions */
export async function fetchCourseBySlug(slug) {
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', slug)
    .limit(1);

  if (courseError) {
    console.error('Error fetching course:', courseError);
    return null;
  }

  const course = courses?.[0];
  if (!course) return null;

  const { data: sectionsData, error: sectionsError } = await supabase
    .from('sections')
    .select(`
      id,
      section_title,
      slug,
      display_order,
      subsections (
        id,
        subsection_title,
        slug,
        lesson_content,
        display_order,
        questions (
          id,
          question_text,
          set_number,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option
        )
      )
    `)
    .eq('course_id', course.id)
    .order('display_order', { ascending: true }); // ✅ FIXED - order by display_order

  if (sectionsError) {
    console.error('Error fetching sections for course:', sectionsError);
    return null;
  }

  const sections = (sectionsData || []).map(section => ({
    id: section.id.toString(),
    slug: section.slug,
    title: section.section_title,
    display_order: section.display_order, // ✅ Include display_order
    subsections: (section.subsections || [])
      .sort((a, b) => (a.display_order ?? Infinity) - (b.display_order ?? Infinity)) // ✅ Sort subsections too
      .map(sub => {
        const setsMap = {};
        (sub.questions || []).forEach(q => {
          const setNum = q.set_number ?? 1;
          if (!setsMap[setNum]) setsMap[setNum] = [];
          setsMap[setNum].push(q);
        });

        const practiceSets = Object.entries(setsMap).map(([num, questions]) => ({
          name: `Set${num}`,
          questions
        }));

        return {
          id: sub.id.toString(),
          moduleId: section.id.toString(),
          slug: sub.slug,
          title: sub.subsection_title,
          description: `${sub.questions?.length || 0} questions`,
          lessonContent: sub.lesson_content ?? '',
          display_order: sub.display_order, // ✅ Include display_order
          practiceSets
        };
      })
  }));

  return {
    id: course.id,
    name: course.name,
    slug: course.slug,
    sections
  };
}
/** Fetch a single subsection by sectionSlug + subsectionSlug */
export async function fetchSubsectionData(sectionSlug, subsectionSlug) {
  // 1. First, find the section by slug
  const { data: sections, error: sectionError } = await supabase
    .from('sections')
    .select('id, course_id, slug')
    .eq('slug', sectionSlug)
    .limit(1)
    .maybeSingle();

  if (sectionError || !sections) {
    console.error('Error fetching section by slug:', sectionError);
    return null;
  }

  const sectionId = sections.id;

  // 2. Fetch the subsection by slug and sectionId
  const { data: subsections, error: subError } = await supabase
    .from('subsections')
    .select(`
      id,
      subsection_title,
      slug,
      lesson_content,
      questions (
        id,
        question_text,
        set_number,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option
      )
    `)
    .eq('slug', subsectionSlug)
    .eq('section_id', sectionId)
    .limit(1)
    .maybeSingle();

  if (subError || !subsections) {
    console.error('Error fetching subsection by slug:', subError);
    return null;
  }

  // 3. Build practice sets
  const setsMap = {};
  (subsections.questions || []).forEach(q => {
    const setNum = q.set_number ?? 1;
    if (!setsMap[setNum]) setsMap[setNum] = [];
    setsMap[setNum].push(q);
  });

  const practiceSets = Object.entries(setsMap).map(([num, questions]) => ({
    name: `Set${num}`,
    questions
  }));

  return {
    id: subsections.id.toString(),
    moduleId: sectionId.toString(),
    courseId: sections.course_id,
    title: subsections.subsection_title,
    lessonContent: subsections.lesson_content ?? '',
    practiceSets
  };
}


/** Fetch all courses (for server-side rendering) */
export async function fetchAllCourses() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, slug, description')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching all courses:', error)
    return []
  }

  return data || []
}

export async function fetchCourseBySlugServer(slug) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', slug)
    .single()

  if (courseError || !courses) return null

  const { data: sectionsData, error: sectionsError } = await supabase
    .from('sections')
    .select(`
      id,
      section_title,
      slug,
      subsections (id, subsection_title, slug, lesson_content)
    `)
    .eq('course_id', courses.id)
    .order('id', { ascending: true })

  if (sectionsError) return null

  return {
    id: courses.id,
    title: courses.title,
    slug: courses.slug,
    sections: sectionsData.map(s => ({
      id: s.id.toString(),
      slug: s.slug,
      title: s.section_title,
      subsections: s.subsections.map(sub => ({
        id: sub.id.toString(),
        slug: sub.slug,
        title: sub.subsection_title
      }))
    }))
  }
}

export async function fetchSubsectionDataServer(sectionSlug, subsectionSlug) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  const { data: sections, error: sectionError } = await supabase
    .from('sections')
    .select('id, course_id, slug')
    .eq('slug', sectionSlug)
    .single()

  if (sectionError || !sections) return null

  const { data: subsections, error: subError } = await supabase
    .from('subsections')
    .select('id, subsection_title, slug, lesson_content')
    .eq('slug', subsectionSlug)
    .eq('section_id', sections.id)
    .single()

  if (subError || !subsections) return null

  return {
    id: subsections.id.toString(),
    moduleId: sections.id.toString(),
    courseId: sections.course_id,
    title: subsections.subsection_title,
    lessonContent: subsections.lesson_content ?? ''
  }
}