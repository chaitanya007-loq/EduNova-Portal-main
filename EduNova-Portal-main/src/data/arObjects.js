export const arObjectsRegistry = [
  {
    id: 'human-heart',
    name: 'Human Heart',
    category: 'Biology',
    confidence: 0.96,
    modelPath: '/models/heart.glb',
    description: 'Four-chambered muscular organ that pumps oxygenated blood through the circulatory system.',
    topics: ['Blood Circulation', 'Cardiac Cycle', 'Heart Chambers', 'Valves'],
    suggestedQuestions: [
      'What does the Left Ventricle do?',
      'How do heart valves prevent backflow?',
      'Explain the cardiac conduction system.'
    ],
    hotspots: [
      {
        id: 'aorta',
        name: 'Aorta',
        position: { x: 0, y: 1.2, z: 0.2 },
        function: 'Main artery conducting oxygenated blood to systemic circulation.',
        simpleExplanation: 'The largest artery carrying fresh oxygenated blood from the heart to the entire body.',
        detailedExplanation: 'Originating from the left ventricle, the ascending aorta curves over the heart into the aortic arch, distributing high-pressure blood via major arterial branches.',
        relatedTopics: ['Systemic Circulation', 'Aortic Valve', 'Arterial Pressure']
      },
      {
        id: 'left-ventricle',
        name: 'Left Ventricle',
        position: { x: -0.4, y: -0.2, z: 0.4 },
        function: 'Pumps oxygenated blood through the aortic valve into systemic circulation.',
        simpleExplanation: 'The thickest muscular chamber responsible for pumping blood out to your muscles and organs.',
        detailedExplanation: 'The left ventricle has significantly thicker myocardium than the right ventricle to generate peak systolic pressure (~120 mmHg) required for systemic vascular resistance.',
        relatedTopics: ['Systolic Pressure', 'Myocardium', 'Stroke Volume']
      },
      {
        id: 'right-atrium',
        name: 'Right Atrium',
        position: { x: 0.5, y: 0.4, z: -0.2 },
        function: 'Receives deoxygenated blood from the superior and inferior vena cava.',
        simpleExplanation: 'The receiving chamber for blood returning from the body after supplying oxygen.',
        detailedExplanation: 'Blood enters the right atrium from systemic veins and flows through the tricuspid valve into the right ventricle during atrial systole.',
        relatedTopics: ['Vena Cava', 'Sinoatrial Node', 'Deoxygenated Blood']
      },
      {
        id: 'pulmonary-artery',
        name: 'Pulmonary Artery',
        position: { x: -0.2, y: 0.9, z: -0.3 },
        function: 'Carries deoxygenated blood from right ventricle to lungs for gas exchange.',
        simpleExplanation: 'The pathway taking used blood to the lungs to pick up fresh oxygen.',
        detailedExplanation: 'Bifurcates into left and right pulmonary arteries supplying alveolar capillaries where CO2 is exchanged for O2.',
        relatedTopics: ['Pulmonary Circulation', 'Alveolar Gas Exchange', 'Hypoxia']
      }
    ]
  },
  {
    id: 'human-brain',
    name: 'Human Brain',
    category: 'Biology',
    confidence: 0.94,
    modelPath: '/models/brain.glb',
    description: 'Central control unit of the nervous system responsible for cognition, memory, emotion, and motor control.',
    topics: ['Cerebral Cortex', 'Neuroanatomy', 'Synaptic Transmission', 'Memory'],
    suggestedQuestions: [
      'What is the main function of the Frontal Lobe?',
      'How does the cerebellum coordinate motor movement?',
      'Explain synaptic transmission.'
    ],
    hotspots: [
      {
        id: 'frontal-lobe',
        name: 'Frontal Lobe',
        position: { x: 0, y: 0.8, z: 0.7 },
        function: 'Decision making, executive function, motor planning, and reasoning.',
        simpleExplanation: 'The front region of your brain responsible for thinking, planning, and personality.',
        detailedExplanation: 'Houses the prefrontal cortex and primary motor cortex, regulating impulse control, voluntary movement, working memory, and language production (Broca area).',
        relatedTopics: ['Prefrontal Cortex', 'Broca Area', 'Executive Control']
      },
      {
        id: 'cerebellum',
        name: 'Cerebellum',
        position: { x: 0, y: -0.7, z: -0.8 },
        function: 'Motor coordination, balance, procedural learning, and fine posture.',
        simpleExplanation: 'Located at the base of the brain, it keeps your balance and coordinates smooth muscle actions.',
        detailedExplanation: 'Contains over 50% of the brain\'s total neurons arranged in densely packed Purkinje cell circuits that fine-tune motor precision via feedback loops.',
        relatedTopics: ['Proprioception', 'Purkinje Cells', 'Motor Feedback']
      },
      {
        id: 'occipital-lobe',
        name: 'Occipital Lobe',
        position: { x: 0, y: 0.3, z: -0.9 },
        function: 'Visual processing cortex interpreting color, shape, motion, and visual recognition.',
        simpleExplanation: 'The visual center at the back of the head that translates optical signals into images.',
        detailedExplanation: 'Contains primary visual area V1 (striate cortex) which parses spatial frequency, orientation vectors, and binocular disparity.',
        relatedTopics: ['V1 Cortex', 'Optic Chiasm', 'Retinotopic Mapping']
      }
    ]
  },
  {
    id: 'atom-structure',
    name: 'Rutherford Atom Model',
    category: 'Physics',
    confidence: 0.97,
    modelPath: '/models/atom.glb',
    description: 'Atomic nucleus surrounded by quantum electron probability orbitals.',
    topics: ['Subatomic Particles', 'Quantum Orbitals', 'Electromagnetism', 'Nuclear Physics'],
    suggestedQuestions: [
      'What holds electrons in orbit around the nucleus?',
      'What is the difference between protons and neutrons?',
      'Explain quantum energy levels.'
    ],
    hotspots: [
      {
        id: 'nucleus',
        name: 'Atomic Nucleus',
        position: { x: 0, y: 0, z: 0 },
        function: 'Dense core containing positively charged protons and neutral neutrons.',
        simpleExplanation: 'The heavy center of the atom bound together by the strong nuclear force.',
        detailedExplanation: 'Composed of nucleons (quarks held together by gluons) containing 99.9% of total atomic mass.',
        relatedTopics: ['Strong Force', 'Protons & Neutrons', 'Mass Defect']
      },
      {
        id: 'electron-cloud',
        name: 'Electron Orbitals',
        position: { x: 0.8, y: 0.5, z: 0.3 },
        function: 'Quantized energy states where negative electrons reside.',
        simpleExplanation: 'Tiny negative particles spinning in high-speed orbital paths around the core.',
        detailedExplanation: 'Governed by Schrödinger wave equations; electrons occupy discrete quantum shells according to the Pauli exclusion principle.',
        relatedTopics: ['Quantum Shells', 'Pauli Exclusion', 'Valence Electrons']
      }
    ]
  },
  {
    id: 'combustion-engine',
    name: 'Cybernetic Engine Cylinder',
    category: 'Engineering',
    confidence: 0.92,
    modelPath: '/models/engine.glb',
    description: 'Four-stroke internal combustion engine converting thermal energy into mechanical torque.',
    topics: ['Thermodynamics', 'Mechanical Power', 'Four-Stroke Cycle', 'Piston Dynamics'],
    suggestedQuestions: [
      'Explain the 4 steps of the combustion cycle.',
      'How does the crankshaft convert motion?',
      'What is the compression ratio?'
    ],
    hotspots: [
      {
        id: 'piston-head',
        name: 'Piston Head',
        position: { x: 0, y: 0.1, z: 0 },
        function: 'Reciprocates vertically inside cylinder under high fuel-air pressure.',
        simpleExplanation: 'The moving block pushed downward by exploding fuel vapor.',
        detailedExplanation: 'Transfers expansive expansion work during the power stroke down through the connecting rod to the crankshaft.',
        relatedTopics: ['Power Stroke', 'Expansion Work', 'Compression Ratio']
      },
      {
        id: 'spark-plug',
        name: 'Spark Plug',
        position: { x: 0, y: 0.9, z: 0 },
        function: 'Ignites compressed fuel-air mixture via high voltage electric arc.',
        simpleExplanation: 'Delivers the electrical spark that ignites fuel in the cylinder.',
        detailedExplanation: 'Fires precise high voltage (~20,000V) pulse near Top Dead Center (TDC) to trigger rapid flame propagation.',
        relatedTopics: ['Ignition Timing', 'Voltage Arc', 'Flame Front']
      }
    ]
  },
  {
    id: 'dna-double-helix',
    name: 'DNA Double Helix',
    category: 'Biology',
    confidence: 0.98,
    modelPath: '/models/dna.glb',
    description: 'Double-stranded nucleic acid polymer storing genetic instructions for all living organisms.',
    topics: ['Nucleotides', 'Base Pairing', 'Replication', 'Genetics'],
    suggestedQuestions: [
      'Which bases pair together in DNA?',
      'How does DNA replication work?',
      'What is the backbone made of?'
    ],
    hotspots: [
      {
        id: 'base-pair',
        name: 'Nitrogenous Base Pair (A-T / C-G)',
        position: { x: 0, y: 0, z: 0.2 },
        function: 'Hydrogen-bonded nucleotide pairing carrying genetic code.',
        simpleExplanation: 'The chemical rungs of the ladder (Adenine pairs with Thymine, Cytosine with Guanine).',
        detailedExplanation: 'Adenine binds Thymine with 2 hydrogen bonds; Cytosine binds Guanine with 3 hydrogen bonds, forming complimentary base pairing rules.',
        relatedTopics: ['Hydrogen Bonds', 'Complementary Strands', 'Genomics']
      },
      {
        id: 'sugar-phosphate',
        name: 'Sugar-Phosphate Backbone',
        position: { x: 0.6, y: 0.4, z: 0.1 },
        function: 'Structural backbone consisting of alternating deoxyribose sugar and phosphate groups.',
        simpleExplanation: 'The solid outer handrails that hold the genetic ladder together.',
        detailedExplanation: 'Formed by phosphodiester bonds between the 3\' carbon atom of one sugar and the 5\' carbon of the adjacent sugar.',
        relatedTopics: ['Phosphodiester Bond', 'Deoxyribose', '5\' to 3\' Direction']
      }
    ]
  },
  {
    id: 'great-pyramid',
    name: 'Great Pyramid of Giza',
    category: 'History',
    confidence: 0.93,
    modelPath: '/models/pyramid.glb',
    description: 'Ancient Egyptian limestone monument built during the Fourth Dynasty for Pharaoh Khufu.',
    topics: ['Ancient Architecture', 'Egyptian History', 'Masonry Engineering', 'Pharaohs'],
    suggestedQuestions: [
      'How were limestone blocks transported?',
      'What is inside the King Chamber?',
      'When was the Great Pyramid constructed?'
    ],
    hotspots: [
      {
        id: 'kings-chamber',
        name: 'King\'s Chamber',
        position: { x: 0, y: 0.2, z: 0 },
        function: 'Central granite burial vault built to house Pharaoh Khufu\'s sarcophagus.',
        simpleExplanation: 'The sacred inner room constructed from solid red granite blocks.',
        detailedExplanation: 'Features relieving stress chambers above the ceiling constructed from massive granite beams weighing up to 50 tons each.',
        relatedTopics: ['Khufu', 'Granite Stress Relief', 'Sarcophagus']
      }
    ]
  }
];

export const getARObjectById = (id) => arObjectsRegistry.find(obj => obj.id === id) || arObjectsRegistry[0];

export const getARObjectsByCategory = (category) =>
  category === 'All' ? arObjectsRegistry : arObjectsRegistry.filter(obj => obj.category === category);
