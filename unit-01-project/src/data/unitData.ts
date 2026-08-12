import { MindMapData, SelfAssessmentData } from '../types';

export const unitMindmapData: MindMapData = {
  centralTopic: "LEISURE TIME",
  branches: [
    {
      id: "vocabulary",
      label: "Vocabulary",
      color: "#3B82C4",
      subItems: [
        "Leisure activities: doing DIY, doing puzzles, playing sport, surfing the net, messaging friends, cooking",
        "Expressions of likes: be fond of, be keen on, be interested in, be crazy about, be into",
        "Expressions of dislikes: thêm 'not' sau 'be' (VD: not fond of, not keen on)"
      ]
    },
    {
      id: "pronunciation",
      label: "Pronunciation",
      color: "#F59E42",
      subItems: [
        "Âm /ʊ/: cook, push, would, woman",
        "Âm /uː/: school, group, June, move",
        "Mẹo: /ʊ/ là âm ngắn, miệng ít mở; /uː/ là âm dài, môi tròn hơn"
      ]
    },
    {
      id: "grammar",
      label: "Grammar",
      color: "#4ADE80",
      subItems: [
        "Verbs + gerund ONLY: dislike, enjoy, detest, fancy",
        "Verbs + gerund OR to-infinitive: love, hate, prefer, like",
        "Be fond of/keen on/interested in/crazy about/into + N hoặc V-ing (không dùng to-V)"
      ]
    },
    {
      id: "communication",
      label: "Communication",
      color: "#A78BFA",
      subItems: [
        "Mời: Would you like to...? / Do you fancy...ing?",
        "Nhận lời: I'd love to. / That's great. Thanks.",
        "Chủ đề: Leisure activities around the world"
      ]
    }
  ]
};

export const selfAssessmentData: SelfAssessmentData = {
  title: "Now I can ...",
  levels: ["✓", "✓✓", "✓✓✓"],
  items: [
    { id: "item-1", skill: "use the words related to leisure activities and expressions about likes and dislikes." },
    { id: "item-2", skill: "pronounce the sounds /ʊ/ and /uː/ correctly in words and sentences." },
    { id: "item-3", skill: "use verbs of liking / disliking followed by gerunds and / or to-infinitives to talk about likes and dislikes." },
    { id: "item-4", skill: "invite and accept invitations." },
    { id: "item-5", skill: "read about leisure activities with family." },
    { id: "item-6", skill: "talk about leisure activities with family." },
    { id: "item-7", skill: "listen about leisure activities with friends." },
    { id: "item-8", skill: "write an email about leisure activities with friends." }
  ]
};
