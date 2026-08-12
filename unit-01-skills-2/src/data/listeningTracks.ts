export interface TranscriptItem {
  speaker: string;
  text: string;
}

export interface TrackItem {
  id: string;
  title: string;
  audioFile: string;
  transcript: TranscriptItem[];
}

export interface ListeningData {
  tracks: TrackItem[];
}

export const listeningData: ListeningData = {
  tracks: [
    {
      id: "track-5",
      title: "Track 5 - Interview with Mark (toàn bộ)",
      audioFile: "track-5.mp3",
      transcript: [
        { speaker: "Interviewer", text: "When do you usually have free time?" },
        { speaker: "Mark", text: "I usually have free time at the weekend." },
        { speaker: "Interviewer", text: "So how do you spend it?" },
        { speaker: "Mark", text: "I spend time to connect with my family on Saturdays. We do puzzles, play board games or go camping." },
        { speaker: "Interviewer", text: "What about Sundays?" },
        { speaker: "Mark", text: "I usually spend Sundays with my friends. I have a group of friends and we do lots of things together." },
        { speaker: "Interviewer", text: "For example?" },
        { speaker: "Mark", text: "Sometimes I invite them to my house. We cook our favourite food and watch a video. It's fun and better than going to the cinema." },
        { speaker: "Interviewer", text: "Do you do outdoor activities together?" },
        { speaker: "Mark", text: "Yes, we love spending time outdoors. We go to the park to play volleyball or skateboard. It helps us stay in shape. Sometimes we go for a bike ride around our city. This gives us a chance to see different places in our city." },
        { speaker: "Interviewer", text: "Thanks for letting us interview you." }
      ]
    },
    {
      id: "track-6",
      title: "Track 6 - Interview with Mark (trích đoạn chi tiết)",
      audioFile: "track-6.mp3",
      transcript: [
        { speaker: "Mark", text: "Sometimes I invite them to my house. We cook our favourite food and watch a video. It's fun and better than going to the cinema." },
        { speaker: "Mark", text: "Yes, we love spending time outdoors. We go to the park to play volleyball or skateboard. It helps us stay in shape. Sometimes we go for a bike ride around our city. This gives us a chance to see different places in our city." }
      ]
    }
  ]
};
