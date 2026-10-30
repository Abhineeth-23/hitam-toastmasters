/**
 * Single source of truth for all club content.
 * Facts are taken from HITAM's published Toastmasters club documents
 * (hitam.org, 2025 & 2026). Update this file when a new term begins.
 */

export const CLUB = {
  name: 'HITAM Toastmasters Club',
  short: 'HITAM Toastmasters',
  college: 'Hyderabad Institute of Technology and Management',
  chartered: 2018,
  district: 'District 126',
  formerDistrict: 'District 98',
  meetingRule: '1st & 3rd Saturday of every month',
  venue: 'HITAM Campus, Gowdavelly, Medchal',
  city: 'Hyderabad, Telangana',
  address: 'Hyderabad Institute of Technology and Management, Gowdavelly, Near Kompally, Medchal, Hyderabad, Telangana 501401',
  // TODO: replace with the club's real inbox before going live.
  email: 'toastmasters@hitam.org',
  mapsQuery: 'Hyderabad Institute of Technology and Management, Gowdavelly, Medchal',
  tiUrl: 'https://www.toastmasters.org',
  hitamUrl: 'https://hitam.org',
  objective:
    'The fundamental objective of the HITAM Toastmasters Club is to empower students through self-improvement and leadership training, helping them build confidence and become more effective at both academic and professional levels.',
  environment:
    'The club provides a supportive and positive learning environment where every member gets the opportunity to develop communication and leadership skills, fostering self-confidence and overall personal growth.',
  disclaimer:
    'The information on this website is for the sole use of Toastmasters’ members, for Toastmasters business only. It is not to be used for solicitation and distribution of non-Toastmasters material or information.',
} as const

export type RouteMeta = {
  path: string
  label: string
  index: string
  blurb: string
  image?: string
  accent: string
}

export const ROUTES: RouteMeta[] = [
  { path: '/', label: 'Home', index: '00', blurb: 'The stage is yours', image: '/images/steps.webp', accent: '#F2DF74' },
  { path: '/about', label: 'About', index: '01', blurb: 'What we stand for', image: '/images/speaker.webp', accent: '#A9B2B1' },
  { path: '/achievements', label: 'Achievements', index: '02', blurb: 'The trophy cabinet', image: '/images/golden-feather.webp', accent: '#F2DF74' },
  { path: '/history', label: 'History', index: '03', blurb: 'Eight terms, one voice', image: '/images/auditorium.webp', accent: '#772432' },
  { path: '/team', label: 'Team', index: '04', blurb: 'The people behind the gavel', image: '/images/group.webp', accent: '#006094' },
  { path: '/join', label: 'Join', index: '05', blurb: 'Your first meeting, decoded', image: '/images/certificates.webp', accent: '#208840' },
  { path: '/contact', label: 'Contact', index: '06', blurb: 'Find the room', image: '/images/atrium.webp', accent: '#A9B2B1' },
  { path: '/admin', label: 'Admin', index: '07', blurb: 'Officers only', accent: '#e5484d' },
]

export const routeFor = (path: string) => ROUTES.find((r) => r.path === path)

export const CORE_VALUES = [
  { name: 'Integrity', line: 'Say what you mean. Mean what you say.', body: 'We speak honestly, evaluate fairly and hold ourselves to the standard we ask of others.' },
  { name: 'Respect', line: 'Every voice gets the floor.', body: 'A nervous first speech deserves the same attention as a contest winner. Always.' },
  { name: 'Service', line: 'Lift the next speaker.', body: 'Officers, evaluators, timers — the club runs because members serve each other.' },
  { name: 'Excellence', line: 'Better than last Saturday.', body: 'Not perfection — progress. Every speech is a draft of the next one.' },
]

export const WHAT_WE_DO = [
  { title: 'Regular Meetings', body: 'Twice a month we practise public speaking and leadership — prepared speeches, impromptu topics and evaluations.' },
  { title: 'Speakathons', body: 'Marathon sessions packed with back-to-back speeches, giving members extended time on stage.' },
  { title: 'Table Topics Marathons', body: 'Rapid-fire impromptu rounds that rewire how fast you think on your feet.' },
  { title: 'Open House Meetings', body: 'Doors-open sessions that introduce Toastmasters to curious newcomers.' },
  { title: 'Joint Club Meetings', body: 'We collaborate with other clubs for diverse audiences and fresh feedback.' },
  { title: 'Speech Contests', body: 'Humorous, Evaluation, International Speech and Table Topics contests — club level and beyond.' },
  { title: 'Conferences', body: 'We participate in and host Toastmasters conferences for wider exposure and networking.' },
]

export const MEETING_ROLES = [
  { n: '01', role: 'Sergeant at Arms', verb: 'opens the floor', body: 'Sets up the room, welcomes guests and calls the meeting to order.', widget: 'gavel' },
  { n: '02', role: 'Toastmaster of the Day', verb: 'hosts the show', body: 'The emcee. Introduces every speaker and keeps the energy moving.', widget: 'mic' },
  { n: '03', role: 'Prepared Speakers', verb: 'take the stage', body: 'Members deliver speeches from their Pathways projects, 5–7 minutes each.', widget: 'speech' },
  { n: '04', role: 'Table Topics Master', verb: 'throws the curveball', body: 'Hands out surprise topics. You get 1–2 minutes and zero preparation.', widget: 'topics' },
  { n: '05', role: 'Evaluators', verb: 'make you better', body: 'Deliver constructive, specific feedback — what worked, what to try next.', widget: 'eval' },
  { n: '06', role: 'Timer', verb: 'keeps it honest', body: 'Green, yellow, red. The lights that every Toastmaster learns to respect.', widget: 'timer' },
  { n: '07', role: 'Ah-Counter', verb: 'hunts filler words', body: 'Counts every “um”, “ah” and “like” — gently, publicly, effectively.', widget: 'ah' },
  { n: '08', role: 'Grammarian', verb: 'guards the language', body: 'Introduces the Word of the Day and notes the best (and worst) phrasing.', widget: 'word' },
  { n: '09', role: 'General Evaluator', verb: 'evaluates everything', body: 'Reviews the meeting itself, so the next one runs even better.', widget: 'star' },
]

export const WORDS_OF_THE_DAY = [
  { word: 'Eloquent', type: 'adj.', def: 'fluent or persuasive in speaking or writing.' },
  { word: 'Candour', type: 'n.', def: 'the quality of being open and honest in expression.' },
  { word: 'Resonate', type: 'v.', def: 'to evoke a feeling of shared emotion or belief.' },
  { word: 'Poise', type: 'n.', def: 'graceful and elegant bearing; composure.' },
  { word: 'Articulate', type: 'adj.', def: 'having or showing the ability to speak fluently and coherently.' },
  { word: 'Gumption', type: 'n.', def: 'shrewd or spirited initiative and resourcefulness.' },
]

export const TABLE_TOPICS = [
  'If your life had a soundtrack, what would track one be?',
  'Convince us that Mondays are actually the best day.',
  'What would you teach if you had to teach a class tomorrow?',
  'Describe the campus canteen as if it were a 5-star restaurant.',
  'What is a small thing that instantly makes your day better?',
  'You wake up as the principal for a day. What changes first?',
  'Which superpower would be the most useless — and why?',
  'Sell us an ordinary pencil in sixty seconds.',
  'Tell us about a time you were completely wrong.',
  'What advice would you give your first-year self?',
  'Should exams be replaced with presentations? Defend your side.',
  'If you could have dinner with any speaker in history, who?',
  'What does “leadership” look like in a group project?',
  'Explain your favourite movie plot badly.',
  'What is one rule you would add to the world?',
  'Describe Hyderabad to someone who has never left their village.',
  'What is the bravest thing you have done this year?',
  'Is it better to be early or to be on time?',
  'Your phone is now a person. What would it say about you?',
  'Make a toast to the person on your left.',
]

export const PATHWAYS_LEVELS = [
  { level: 1, name: 'Mastering Fundamentals', body: 'Your Ice Breaker. Your first evaluation. The courage to begin.' },
  { level: 2, name: 'Learning Your Style', body: 'Discover how you communicate — and how others hear you.' },
  { level: 3, name: 'Increasing Knowledge', body: 'Elective projects that stretch your range in your chosen path.' },
  { level: 4, name: 'Building Skills', body: 'Complex projects that blend speaking with leadership.' },
  { level: 5, name: 'Demonstrating Expertise', body: 'Lead a real project. Mentor. Leave the club stronger than you found it.' },
]

export type Achievement = {
  title: string
  who: string
  detail: string
  year?: string
  category: 'Club' | 'Contest' | 'Leadership' | 'Education'
  highlight?: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  { title: 'Epic Club Award', who: 'HITAM Toastmasters Club', detail: 'Recognised as an Epic Club — awarded to the club as a whole.', category: 'Club', highlight: true },
  { title: 'The Focus Award', who: 'HITAM Toastmasters Club', detail: 'For staying on track to achieve the club goals. Presented by the Club Growth Directors, District 98.', year: '2021–22', category: 'Club', highlight: true },
  { title: 'Pathways Change Maker Award', who: 'HITAM Toastmasters Club', detail: 'District 98 — for having all seven club officers on Pathways. “Thank you for inspiring us.”', year: '2019', category: 'Club', highlight: true },
  { title: '“How is the Josh” Contest — Winners', who: 'HITAM Toastmasters (Area H2)', detail: 'Presented at Eloquence 2019, the District 98 Annual Conference, Pune, 17–19 May 2019.', year: '2019', category: 'Club' },
  { title: 'PR Stalwart Award', who: 'Aditi Bandaru', detail: 'Inducted into the Hall of Fame, District 126.', category: 'Leadership', highlight: true },
  { title: 'Area Director, Area H3', who: 'Akshitha Thakur', detail: 'ECE (2020–24) and Student Director at HITAM — elected Area Director for Area H3, District 126.', category: 'Leadership' },
  { title: 'Golden Feather Award', who: 'Deeksha Chettikam', detail: 'Area H2 — Euphoria 2025.', year: '2025', category: 'Leadership' },
  { title: 'Golden Feather Award', who: 'Lasya Sree', detail: 'Also recognised as Pathways focal for Division G.', year: '2019', category: 'Leadership' },
  { title: 'Division Champion — Humorous & Evaluation', who: 'Rahil', detail: 'Won the Division Level Humorous Speech Contest and Evaluation Contest.', category: 'Contest', highlight: true },
  { title: 'Evaluation Speech Contest — Area N1', who: 'Sriya', detail: 'First place, Area N1 Evaluation Speech Contest.', category: 'Contest' },
  { title: 'Humorous Speech Contest — Area N1', who: 'Srivallika', detail: 'First place, Area N1 Humorous Speech Contest.', category: 'Contest' },
  { title: 'Division-level Representative', who: 'Rajeev', detail: 'Represented the club at Division level in the Humorous and Evaluation contests.', category: 'Contest' },
  { title: 'Triple First — Humorous & International', who: 'G. Shiva', detail: '1st place Humorous Speech Contest; 1st in International Speech Contest at club and area level.', category: 'Contest' },
  { title: 'Pathways Level 2 Completed', who: 'Rebecca · Manish', detail: 'Early members to complete Level 2 of Pathways.', category: 'Education' },
  { title: 'Pathways Level 1 Completed', who: 'Shiva · Lasya · Hema · Sparsha · Pranav · Jasmitha', detail: 'The first cohort to complete Level 1 of Pathways.', category: 'Education' },
  { title: 'HITAM Toastmasters App', who: 'Akshit', detail: 'Built a club app with Members, Meetings, Ah-Counter, Timer, Grammarian and Table Topics tools.', category: 'Education' },
]

export type Officer = { name: string; role: string }
export type Term = { term: string; officers: Officer[]; note?: string }

export const ROLE_DUTIES: Record<string, string> = {
  President: 'Provides overall leadership and strategic direction to the club, guiding members and supporting all activities.',
  'VP Education': 'Coordinates meeting schedules and speaking assignments, and supports every member’s educational progress.',
  'VP Membership': 'Oversees membership growth and retention, ensuring a welcoming environment and smooth onboarding.',
  'VP Public Relations': 'Manages the club’s public image, communications, social media presence and brand.',
  Secretary: 'Maintains accurate records, documentation and meeting minutes; keeps membership records up to date.',
  Treasurer: 'Responsible for financial management — dues collection, budgeting and timely reporting.',
  'Sergeant at Arms': 'Manages meeting logistics and club equipment; ensures every meeting is set up and runs smoothly.',
  'Immediate Past President': 'Serves as a resource and mentor to the new club officers.',
}

const t = (president: string, vpe: string, vpm: string, vppr: string, sec: string, tres: string, saa: string, ipp?: string): Officer[] => [
  { name: president, role: 'President' },
  { name: vpe, role: 'VP Education' },
  { name: vpm, role: 'VP Membership' },
  { name: vppr, role: 'VP Public Relations' },
  { name: sec, role: 'Secretary' },
  { name: tres, role: 'Treasurer' },
  { name: saa, role: 'Sergeant at Arms' },
  ...(ipp ? [{ name: ipp, role: 'Immediate Past President' }] : []),
]

/** Most recent first. */
export const TERMS: Term[] = [
  { term: '2025–26', officers: t('Alwala Satvika Reddy', 'Bhavyanjali Medukonduru', 'Anusha Aakula', 'Sriya N. Yazali', 'Sri Harshika G', 'Aswitha N. Pamarthi', 'Sarah Snigdha Chikelay', 'Kaushik N. R.P.') },
  { term: '2024–25', officers: t('Kaushik N. R.P.', 'Pravallika Varma Sayyaparaju', 'Deeksha Chettikam', 'Hrushita Kante Kamakshi', 'Gopya Boppana', 'Rambhatla V. Vivekananda Sastry', 'Alwala Satvika Reddy') },
  { term: '2023–24', officers: t('Akshitha Thakur', 'Sriya Seethepalli', 'Aditi Bandaru', 'Pravallika Varma Sayyaparaju', 'Manaswini Durgumahanthi', 'Vasavi Vemuganti', 'Hrushita Kante Kamakshi', 'Rajeev Maroju') },
  { term: '2022–23', officers: t('Rajeev Maroju', 'Rupali Mishra', 'Akshitha Thakur', 'Aditi Bandaru', 'Shiva Rakshitha Banda', 'Tummala Madhu', 'Kaushik N. R.P.', 'Rahil Hussain') },
  { term: '2021–22', officers: t('Rahil Hussain', 'Rajeev Maroju', 'Sai SriHarsa Talluri', 'Ruthvika Mamidyala', 'Rupali Mishra', 'Bheemsen Kulkarni', 'Jatin B') },
  { term: '2020–21', officers: t('Manish A. Arcot', 'Rahil Hussain', 'Rajeev Maroju', 'Rupali Mishra', 'Jyothsna Karuparthi', 'Sai SriHarsa Talluri', 'Pranav T.A', 'Rebecca B') },
  { term: '2019–20', officers: t('Rebecca B', 'Manish A. Arcot', 'Hema Uppuluri', 'Sparsha Perupalli', 'Jasmitha A. Orusu', 'Pallavi Mamidala', 'Karthik Dumpala', 'Lasya Priya Nanabolu') },
  { term: '2018–19', officers: t('Lasya Priya Nanabolu', 'Shiva G', 'Hema Uppuluri', 'Arzitha Rachakonda', 'Srishti Toutam', 'Radha Burra', 'Chintalapati Manasa'), note: 'Charter term' },
]

export const CURRENT_TERM = TERMS[0]

export type Milestone = { year: string; title: string; body: string; tag: string }

export const MILESTONES: Milestone[] = [
  { year: '2018', tag: 'Charter', title: 'The first gavel falls', body: 'HITAM Toastmasters Club is chartered under District 98 with Lasya Priya Nanabolu as its founding President.' },
  { year: '2019', tag: 'Breakthrough', title: 'Every officer on Pathways', body: 'The club earns the Pathways Change Maker Award and wins the “How is the Josh” contest at Eloquence 2019 in Pune. A student-built club app arrives.' },
  { year: '2020', tag: 'Resilience', title: 'The stage goes online', body: 'Meetings move to video calls. Saturdays keep their rhythm — “irrespective of the circumstances.”' },
  { year: '2021', tag: 'Focus', title: 'Staying on track', body: 'District 98 presents the club with The Focus Award for achieving its goals through 2021–22.' },
  { year: '2023', tag: 'New District', title: 'The District 126 era', body: 'The club now competes and leads within District 126 — and its members start representing HITAM at Division level.' },
  { year: '2024', tag: 'Recognition', title: 'Leaders beyond the club', body: 'Alumna Akshitha Thakur serves as Area Director, Area H3. Aditi Bandaru enters the District 126 Hall of Fame with the PR Stalwart Award.' },
  { year: '2025', tag: 'Golden Feather', title: 'Euphoria 2025', body: 'Deeksha Chettikam receives the Golden Feather Award at Area H2’s Euphoria 2025. The eighth committee takes office.' },
  { year: '2026', tag: 'Next', title: 'Your name here', body: 'Every milestone on this page began with one nervous first speech. The next chapter is unwritten — and the stage is open.' },
]

export const GALLERY = [
  { src: '/images/steps.webp', caption: 'The whole club, HITAM steps' },
  { src: '/images/speaker.webp', caption: 'Mid-speech, mid-gesture' },
  { src: '/images/auditorium.webp', caption: 'A full house' },
  { src: '/images/group.webp', caption: 'After a Saturday meeting' },
  { src: '/images/certificates.webp', caption: 'Certificates earned' },
  { src: '/images/atrium.webp', caption: 'Joint meeting, atrium' },
  { src: '/images/online.webp', caption: 'The online years' },
]

export const GUEST_STEPS = [
  { n: '01', title: 'Walk in as a guest', body: 'No forms, no fees. Show up on a 1st or 3rd Saturday and introduce yourself to the Sergeant at Arms.' },
  { n: '02', title: 'Watch a meeting', body: 'See prepared speeches, evaluations and Table Topics. Guests may try a Table Topic — only if they want to.' },
  { n: '03', title: 'Become a member', body: 'Talk to the VP Membership. You will be onboarded onto Toastmasters International and Pathways.' },
  { n: '04', title: 'Give your Ice Breaker', body: 'Your first 4–6 minute speech: introduce yourself. The scariest, best speech you will ever give.' },
]

export const FIRST_MEETING = [
  { t: '00:00', what: 'Call to order', who: 'Sergeant at Arms' },
  { t: '00:05', what: 'Welcome & roles introduced', who: 'Toastmaster of the Day' },
  { t: '00:10', what: 'Word of the Day', who: 'Grammarian' },
  { t: '00:15', what: 'Prepared speeches', who: 'Speakers' },
  { t: '00:40', what: 'Table Topics', who: 'Table Topics Master' },
  { t: '01:00', what: 'Evaluations', who: 'Evaluators' },
  { t: '01:15', what: 'Reports: timer, ah-counter, grammarian', who: 'Functionaries' },
  { t: '01:25', what: 'General evaluation & awards', who: 'General Evaluator' },
]

export const FAQ = [
  { q: 'Do I have to speak at my first meeting?', a: 'No. Guests are welcome to just watch. If you feel brave, you can volunteer for a Table Topic — a short, fun, impromptu answer.' },
  { q: 'Who can join?', a: 'Any HITAM student who wants to speak, lead or simply get less nervous in front of people. Every branch, every year.' },
  { q: 'What is Pathways?', a: 'Toastmasters International’s learning programme: speech projects across five levels, each with structured feedback from an evaluator.' },
  { q: 'How often do you meet?', a: 'Twice a month — on the 1st and 3rd Saturday — and we keep that rhythm irrespective of the circumstances.' },
  { q: 'Is this only about public speaking?', a: 'No. Running meetings, evaluating, mentoring and serving as an officer builds real leadership skills too.' },
]

/** Toastmasters International facts used in copy. */
export const TI = {
  founded: 1924,
  tagline: 'Where Leaders Are Made',
}
