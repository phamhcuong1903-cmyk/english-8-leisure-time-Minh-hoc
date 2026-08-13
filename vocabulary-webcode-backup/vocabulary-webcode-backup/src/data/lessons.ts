export interface LessonItem {
  id: number;
  title: string;
  subtitle: string;
  iconClass: string;
  description: string;
  link: string;
  tag: string;
}

export const LESSONS: LessonItem[] = [
  {
    id: 1,
    title: 'Getting Started',
    subtitle: 'Khởi động bài học',
    iconClass: 'fa-solid fa-comments',
    description: 'Làm quen hội thoại và từ vựng đầu bài',
    link: 'https://unit-01-getting-started.vercel.app',
    tag: 'Hội thoại & Khởi động',
  },
  {
    id: 2,
    title: 'A Closer Look 1',
    subtitle: 'Từ vựng & Phát âm',
    iconClass: 'fa-solid fa-book-open',
    description: 'Từ vựng và phát âm /ʊ/, /uː/',
    link: 'https://unit-01-leisure-time-closer-look-1.vercel.app',
    tag: 'Vocabulary & /ʊ/ - /uː/',
  },
  {
    id: 3,
    title: 'A Closer Look 2',
    subtitle: 'Ngữ pháp trọng tâm',
    iconClass: 'fa-solid fa-spell-check',
    description: 'Ngữ pháp: Verbs + gerund/to-infinitive',
    link: 'https://unit-01-closer-look-2.vercel.app',
    tag: 'Grammar Focus',
  },
  {
    id: 4,
    title: 'Communication',
    subtitle: 'Giao tiếp & Khám phá',
    iconClass: 'fa-solid fa-map-location-dot',
    description: 'Luyện nghe, xem video và khám phá bản đồ thế giới',
    link: 'https://unit1-communication.vercel.app',
    tag: 'Video & Bản đồ',
  },
  {
    id: 5,
    title: 'Skills 1',
    subtitle: 'Kỹ năng Đọc & Nói',
    iconClass: 'fa-solid fa-book-open-reader',
    description: 'Đọc hiểu và luyện nói',
    link: 'https://unit1-skills1.vercel.app',
    tag: 'Reading & Speaking',
  },
  {
    id: 6,
    title: 'Skills 2',
    subtitle: 'Kỹ năng Nghe & Viết',
    iconClass: 'fa-solid fa-headphones',
    description: 'Nghe và viết email',
    link: 'https://unit1-skills2.vercel.app',
    tag: 'Listening & Writing',
  },
  {
    id: 7,
    title: 'Looking Back',
    subtitle: 'Ôn tập & Đánh giá',
    iconClass: 'fa-solid fa-trophy',
    description: 'Quiz tổng hợp ôn tập',
    link: 'https://unit-01-looking-back.vercel.app',
    tag: 'Review Quiz',
  },
  {
    id: 8,
    title: 'Project',
    subtitle: 'Dự án học tập',
    iconClass: 'fa-solid fa-diagram-project',
    description: 'Mindmap tổng kết và tự đánh giá',
    link: 'https://unit1-project.vercel.app',
    tag: 'Mindmap & Tự đánh giá',
  },
  {
    id: 9,
    title: 'Vocabulary',
    subtitle: 'Luyện từ vựng chuyên sâu',
    iconClass: 'fa-solid fa-layer-group',
    description: '6 chế độ luyện từ vựng: Flashcard, Quiz, Bingo...',
    link: 'https://unit1-vocalbulary.vercel.app/',
    tag: '6 chế độ luyện tập',
  },
];
