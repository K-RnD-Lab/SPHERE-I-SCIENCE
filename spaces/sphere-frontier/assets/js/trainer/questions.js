// Universal exam structure — Foundation + SET spheres + Combos
// Foundation: Logic, Math + English (base for all exams)
// SET: Specialized exam by sphere
// Combos: Cross-sphere specializations (like registry)
const SPHERES={
  // Foundation — base literacy for all exams
  foundation:{name:"Foundation",icon:"\u{1F4DA}",color:"var(--ink)",
    bachelor:["Logic","Math"],  // core foundation (no English)
    master:["Logic","Statistics"]},
  F:{name:"Foundation",icon:"\u{1F4DA}",color:"var(--ink)",
    bachelor:["Logic","Math"],  // core foundation (no English)
    master:["Logic","Statistics"]},
  english:{name:"English",icon:"\u{1F1EC}\u{1F1E7}",color:"var(--ink)",
    bachelor:["Reading","Grammar","Vocabulary","Listening"],
    master:["Academic Reading","Advanced Grammar","Academic Writing","Listening"]},
  // SET spheres — specialized exams
  S:{name:"Science",icon:"\u{1FA7A}",color:"var(--science)",
    bachelor:["Biology","Chemistry","Physics","Bioinformatics","Scientific Computing"],
    master:["Molecular Biology","Biochemistry","Biophysics","Computational Biology","Bioinformatics Engineering"]},
  E:{name:"Entrepreneurship",icon:"\u{1F4BC}",color:"var(--entrepreneurship)",
    bachelor:["Management","Marketing","Finance","Economics","Business Analytics"],
    master:["Strategic Leadership","Innovation Mgmt","Venture Finance","Behavioral Econ","ERP Systems"]},
  T:{name:"Technology",icon:"\u{1F4BB}",color:"var(--technology)",
    bachelor:["Programming","Algorithms","Databases","Networking","Tech Literacy","AI/ML Basics"],
    master:["AI/ML Engineering","Software Systems","Data Science","Cybersecurity","Digital Ethics"]},
  // Combos — cross-sphere specializations
  ST:{name:"Science + Technology",icon:"\u{1FA7A}\u{1F4BB}",color:"var(--science)",
    bachelor:["Bioinformatics","Biotech Engineering","Scientific Computing","Data Analysis"],
    master:["Computational Biology","Bioinformatics Engineering","AI for Science","Biostatistics"]},
  ET:{name:"Entrepreneurship + Technology",icon:"\u{1F4BC}\u{1F4BB}",color:"var(--entrepreneurship)",
    bachelor:["Digital Marketing","ERP Systems","Business Analytics","IT Management"],
    master:["Digital Transformation","Venture Tech","Data-Driven Strategy","Platform Engineering"]},
  SE:{name:"Science + Entrepreneurship",icon:"\u{1FA7A}\u{1F4BC}",color:"var(--science)",
    bachelor:["Pharma Management","Health Economics","Biotech Business","Clinical Trials"],
    master:["Healthcare Innovation","Bioventures","Regulatory Science","Medical Marketing"]}
};

const RES={
  guide:[
    {l:"📘 ЄВІ/ЄФВВ guide: ТЗНК + English + IT",u:"./study_guides/master_prep_exam_guide_v28_efvv_2026_full.pdf"},
    {l:"🇬🇧 English error-focus mini guide",u:"./study_guides/english_error_focus_v1.pdf"},
    {l:"🌐 HTML version of the main guide",u:"./study_guides/master_prep_exam_guide_v28_efvv_2026_full.html"}
  ],
  tznk:[
    {l:"🧠 ZNO/Освіта: ТЗНПК варіанти",u:"https://zno.osvita.ua/master/tznpk/list.html"},
    {l:"🧩 ZNO/Освіта: ТЗНК variant 1",u:"https://zno.osvita.ua/master/tznpk/tag-tznk_variant_1/"},
    {l:"📚 Math Corporation: логіка / TZNK-style practice",u:"https://www.mathcorporation.com/quizzes/english-master-zno?year=all"}
  ],
  english:[
    {l:"🇬🇧 ZNO/Освіта: English master tests",u:"https://zno.osvita.ua/master/english/list.html"},
    {l:"🇬🇧 Math Corporation: English Master ZNO",u:"https://www.mathcorporation.com/quizzes/english-master-zno?year=all"}
  ],
  it:[
    {l:"💻 ZNO/Освіта: Master IT tests",u:"https://zno.osvita.ua/master/it"},
    {l:"🛠️ Connected: додаткові тести",u:"https://connected.com.ua/tests/"}
  ],
  nmt:[
    {l:"🎓 ZNO/Освіта: НМТ / шкільна база",u:"https://zno.osvita.ua/"}
  ],
  research:[
    {l:"🧙 Oksana Kolisnyk - TEZv / K-RnD Lab research context",u:"./index.html"},
    {l:"📊 Training Analytics",u:"./training-analytics.html"}
  ]
};
