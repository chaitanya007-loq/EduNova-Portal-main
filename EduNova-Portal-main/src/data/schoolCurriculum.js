// EduNova School Curriculum Hierarchy Data (CBSE / ICSE / State Board)

export const SCHOOL_BOARDS = ['CBSE', 'ICSE', 'State Board', 'International Baccalaureate (IB)'];

export const SCHOOL_CLASSES = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11 (Science)',
  'Class 11 (Commerce)',
  'Class 12 (Science)',
  'Class 12 (Commerce)'
];

export const SCHOOL_SUBJECTS = {
  'Class 10': [
    {
      id: 'sch_sub_math',
      name: 'Mathematics',
      icon: '📐',
      color: '#6366f1',
      chapters: [
        { id: 'ch_real_nums', name: 'Real Numbers', topicsCount: 4, progress: 100 },
        { id: 'ch_polynomials', name: 'Polynomials', topicsCount: 5, progress: 90 },
        { id: 'ch_quadratic', name: 'Quadratic Equations', topicsCount: 6, progress: 45, weak: true },
        { id: 'ch_triangles', name: 'Triangles & Trigonometry', topicsCount: 8, progress: 30 }
      ]
    },
    {
      id: 'sch_sub_sci',
      name: 'Science (Physics, Chem, Bio)',
      icon: '🔬',
      color: '#06b6d4',
      chapters: [
        { id: 'ch_chem_rxn', name: 'Chemical Reactions & Equations', topicsCount: 5, progress: 50, weak: true },
        { id: 'ch_light', name: 'Light: Reflection & Refraction', topicsCount: 7, progress: 70 },
        { id: 'ch_human_eye', name: 'Human Eye & Colourful World', topicsCount: 4, progress: 85 },
        { id: 'ch_electricity', name: 'Electricity & Circuit Optics', topicsCount: 6, progress: 40 }
      ]
    },
    {
      id: 'sch_sub_eng',
      name: 'English Language & Literature',
      icon: '📚',
      color: '#a855f7',
      chapters: [
        { id: 'ch_first_flight', name: 'First Flight Prose & Poetry', topicsCount: 10, progress: 60 },
        { id: 'ch_footprints', name: 'Footprints Without Feet', topicsCount: 8, progress: 80 },
        { id: 'ch_grammar', name: 'Advanced Grammar & Writing', topicsCount: 6, progress: 30 }
      ]
    },
    {
      id: 'sch_sub_sst',
      name: 'Social Science (History, Geo, Civics)',
      icon: '🏛️',
      color: '#f59e0b',
      chapters: [
        { id: 'ch_hist_europe', name: 'Rise of Nationalism in Europe', topicsCount: 5, progress: 65 },
        { id: 'ch_geo_res', name: 'Resources and Development', topicsCount: 4, progress: 90 }
      ]
    }
  ]
};
