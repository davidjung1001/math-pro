const fetchSections = async () => {
  const { data: sectionsData } = await supabase
    .from('sections')
    .select(`
      id,
      section_title,
      subsections (
        id,
        subsection_title
      )
    `)
    .eq('course_slug', slug)
    .order('section_title', { ascending: true })
    .limit(2); // Only show first 2 sections for preview
  setSections(sectionsData);
};
