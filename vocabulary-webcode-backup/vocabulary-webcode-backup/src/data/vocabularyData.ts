export interface WordItem {
  id: number;
  word: string;
  ipa: string;
  type: string;
  meaning: string;
  example: string;
  section: string;
}

export interface VocabularyData {
  unitTitle: string;
  words: WordItem[];
}

export const vocabularyData: VocabularyData = {
  "unitTitle": "Unit 1: Leisure Time - Tiếng Anh 8 Global Success",
  "words": [
    { "id": 1, "word": "look for", "ipa": "lʊk fɔːr", "type": "phr.v", "meaning": "tìm kiếm", "example": "I've been looking for that book everywhere.", "section": "Getting Started" },
    { "id": 2, "word": "knitting kit", "ipa": "'nɪt.ɪŋ kɪt", "type": "np", "meaning": "bộ dụng cụ đan", "example": "Our knitting kits have been lovingly curated so that you can create your own beautiful garments with ease.", "section": "Getting Started" },
    { "id": 3, "word": "be keen on", "ipa": "biː kiːn ɒn", "type": "adj", "meaning": "thích, yêu thích làm gì", "example": "I am keen on cooking.", "section": "Getting Started" },
    { "id": 4, "word": "DIY activity", "ipa": "æk'tɪv.ə.ti", "type": "np", "meaning": "các hoạt động tự làm", "example": "There are many fun DIY activities for children indoors.", "section": "Getting Started" },
    { "id": 5, "word": "build dollhouses", "ipa": "bɪld 'dɒl.haʊs", "type": "vp", "meaning": "xây nhà búp bê", "example": "Mai's hobby is building dollhouses.", "section": "Getting Started" },
    { "id": 6, "word": "make paper flowers", "ipa": "meɪk 'peɪ.pə 'flaʊ.ə", "type": "vp", "meaning": "làm hoa giấy", "example": "My daughter is skillful at making paper flowers.", "section": "Getting Started" },
    { "id": 7, "word": "free time = leisure time", "ipa": "'friː 'taɪm", "type": "np", "meaning": "thời gian rảnh", "example": "In my leisure time, I love knitting, building dollhouses and making paper flowers.", "section": "Getting Started" },
    { "id": 8, "word": "hang out", "ipa": "hæŋ aʊt", "type": "phr.v", "meaning": "đi chơi", "example": "I usually hang out with my friends.", "section": "Getting Started" },
    { "id": 9, "word": "play sport", "ipa": "pleɪ spɔːt", "type": "vp", "meaning": "chơi thể thao", "example": "I'm not interested in playing sport.", "section": "Getting Started" },
    { "id": 10, "word": "go to the cinema", "ipa": "ɡəʊ tuː ðə 'sɪnəmə", "type": "vp", "meaning": "đi xem phim", "example": "Do you fancy going to the cinema this weekend?", "section": "Getting Started" },
    { "id": 11, "word": "go cycling", "ipa": "ɡəʊ 'saɪklɪŋ", "type": "vp", "meaning": "đạp xe", "example": "We go to the cinema, go cycling, or play sport in the park.", "section": "Getting Started" },
    { "id": 12, "word": "ride a horse", "ipa": "raɪd ə hɔːs", "type": "vp", "meaning": "cưỡi ngựa", "example": "She enjoys riding a horse at the riding club.", "section": "Getting Started" },
    { "id": 13, "word": "comedy", "ipa": "'kɒmədi", "type": "n", "meaning": "hài kịch", "example": "Tom, Mark, Trang and Mai are going to see a comedy this morning.", "section": "Getting Started" },
    { "id": 14, "word": "do DIY", "ipa": "duː diː aɪ 'waɪ", "type": "vp", "meaning": "tự tay làm", "example": "I'm not crazy about doing DIY.", "section": "Getting Started" },
    { "id": 15, "word": "do puzzles", "ipa": "duː 'pʌz.əl", "type": "vp", "meaning": "giải ô chữ", "example": "Tom enjoys doing puzzles, especially Sudoku.", "section": "Getting Started" },
    { "id": 16, "word": "surf the net", "ipa": "sɜːf ðə net", "type": "vp", "meaning": "lướt internet", "example": "My brother spends lots of time surfing the net.", "section": "Getting Started" },
    { "id": 17, "word": "message friends", "ipa": "'mes.ɪdʒ frendz", "type": "vp", "meaning": "nhắn tin với bạn bè", "example": "Messaging friends is a popular way for teens to spend their free time.", "section": "Getting Started" },
    { "id": 18, "word": "a mental exercise", "ipa": "ə 'men.təl 'ek.sə.saɪz", "type": "np", "meaning": "bài luyện tập trí não", "example": "Ann enjoys doing mental exercise.", "section": "Getting Started" },

    { "id": 19, "word": "save money", "ipa": "seɪv 'mʌn.i", "type": "vp", "meaning": "tiết kiệm tiền", "example": "We need to save money.", "section": "A Closer Look 1" },
    { "id": 20, "word": "creativity", "ipa": ",kriːeɪ'tɪvəti", "type": "n", "meaning": "sự sáng tạo", "example": "They value creativity.", "section": "A Closer Look 1" },
    { "id": 21, "word": "improve", "ipa": "ɪm'pruːv", "type": "v", "meaning": "cải thiện", "example": "They should improve the lives of people in the countryside.", "section": "A Closer Look 1" },
    { "id": 22, "word": "physical health", "ipa": "'fɪz.ɪ.kəl helθ", "type": "np", "meaning": "sức khỏe thể chất", "example": "Despite her energy, Ann's physical health was sometimes poor.", "section": "A Closer Look 1" },
    { "id": 23, "word": "make friends", "ipa": "meɪk frendz", "type": "vp", "meaning": "kết bạn", "example": "The child is trying to make friends with the dog.", "section": "A Closer Look 1" },
    { "id": 24, "word": "keep in touch", "ipa": "kiːp ɪn tʌtʃ", "type": "phr.v", "meaning": "giữ liên lạc", "example": "Lan still keeps in touch with her old friends.", "section": "A Closer Look 1" },
    { "id": 25, "word": "relaxed", "ipa": "rɪ'lækst", "type": "adj", "meaning": "thư giãn", "example": "My parents are fairly relaxed about me staying out late.", "section": "A Closer Look 1" },
    { "id": 26, "word": "computer skill", "ipa": "kəm'pjuː.tər skɪl", "type": "np", "meaning": "kỹ năng máy tính", "example": "What are basic computer skills?", "section": "A Closer Look 1" },
    { "id": 27, "word": "learn something about IT", "ipa": "lɜːn 'sʌm.θɪŋ ə'baʊt", "type": "vp", "meaning": "học một thứ gì đó về công nghệ", "example": "She learns computer sciences about IT.", "section": "A Closer Look 1" },

    { "id": 28, "word": "be crazy about", "ipa": "biː 'kreɪ.zi ə'baʊt", "type": "adj", "meaning": "say mê với", "example": "I'm crazy about cooking.", "section": "A Closer Look 2" },
    { "id": 29, "word": "be fond of", "ipa": "biː fɒnd əv", "type": "phr", "meaning": "thích thú với", "example": "She is fond of doing DIY.", "section": "A Closer Look 2" },
    { "id": 30, "word": "be interested in", "ipa": "biː 'ɪntrɪstɪd ɪn", "type": "phr", "meaning": "hứng thú với", "example": "Ann is interested in playing sports.", "section": "A Closer Look 2" },
    { "id": 31, "word": "not be into", "ipa": "nɒt biː 'ɪn.tuː", "type": "phr", "meaning": "không thích thú", "example": "My brother isn't into doing puzzles.", "section": "A Closer Look 2" },
    { "id": 32, "word": "take a photo", "ipa": "teɪk fəʊ.təʊ", "type": "vp", "meaning": "chụp ảnh", "example": "In my free time, I usually go out and take photos of people and things.", "section": "A Closer Look 2" },
    { "id": 33, "word": "go to a museum", "ipa": "ɡəʊ tuː mjuː'ziː.əm", "type": "vp", "meaning": "đi bảo tàng", "example": "She often goes to museums to see new exhibits and learn about the past.", "section": "A Closer Look 2" },
    { "id": 34, "word": "see new exhibit", "ipa": "siː njuː ɪɡ'zɪb.ɪt", "type": "vp", "meaning": "xem triển lãm", "example": "She oftens goes to museums to see new exhibits and learn about the past.", "section": "A Closer Look 2" },
    { "id": 35, "word": "go out", "ipa": "ɡəʊ aʊt", "type": "phr.v", "meaning": "ra ngoài", "example": "You can't go out to play because you need to finish your homework.", "section": "A Closer Look 2" },

    { "id": 36, "word": "chef", "ipa": "ʃef", "type": "n", "meaning": "đầu bếp", "example": "My sister wants to become a chef in the future.", "section": "Communication" },
    { "id": 37, "word": "pumpkin soup", "ipa": "'pʌmp.kɪn suːp", "type": "np", "meaning": "súp bí đỏ", "example": "My mom loves pumpkin soup and coffee with a little of sugar.", "section": "Communication" },
    { "id": 38, "word": "watch the cartoon", "ipa": "wɒtʃ ðə kɑː'tuːn", "type": "vp", "meaning": "xem hoạt hình", "example": "My brother is fond of watching the cartoon about a clever wolf.", "section": "Communication" },
    { "id": 39, "word": "enjoy = like = prefer = fancy", "ipa": "ɪn'dʒɔɪ", "type": "v", "meaning": "thích", "example": "She enjoys cooking.", "section": "Communication" },
    { "id": 40, "word": "detest = hate", "ipa": "dɪ'test heɪt", "type": "v", "meaning": "ghét", "example": "They detest playing sports because it's tiring.", "section": "Communication" },

    { "id": 41, "word": "cruel", "ipa": "'kruːəl", "type": "adj", "meaning": "độc ác", "example": "Do not be cruel.", "section": "Skills 1" },
    { "id": 42, "word": "harm animals", "ipa": "hɑːm 'æn.ɪ.məl", "type": "vp", "meaning": "làm hại động vật", "example": "Hunting is cruel to harm animals.", "section": "Skills 1" },
    { "id": 43, "word": "hurt", "ipa": "hɜːt", "type": "v", "meaning": "làm tổn thương, làm đau", "example": "Tell me where it hurts.", "section": "Skills 1" },
    { "id": 44, "word": "invitation", "ipa": ",ɪnvɪ'teɪʃn", "type": "n", "meaning": "lời mời", "example": "She sends me an invitation to go to her birthday party.", "section": "Skills 1" },
    { "id": 45, "word": "accept", "ipa": "æk'sept", "type": "v", "meaning": "chấp nhận", "example": "I accept her invitation.", "section": "Skills 1" },
    { "id": 46, "word": "judo club", "ipa": "'dʒuːdəʊ klʌb", "type": "np", "meaning": "câu lạc bộ võ judo", "example": "My friends go to judo club every Sunday.", "section": "Skills 1" },

    { "id": 47, "word": "home-made", "ipa": "həʊm meɪd", "type": "adj", "meaning": "tự làm", "example": "I invite my friend to try my home-made pizza.", "section": "Skills 2" },
    { "id": 48, "word": "invite", "ipa": "ɪn'vaɪt", "type": "v", "meaning": "mời", "example": "She invites her friends to play badminton.", "section": "Skills 2" },
    { "id": 49, "word": "paper folding", "ipa": "'peɪ.pə 'fəʊldɪŋ", "type": "np", "meaning": "gấp giấy", "example": "Origami is the art of paper folding.", "section": "Skills 2" },
    { "id": 50, "word": "famous", "ipa": "'feɪməs", "type": "adj", "meaning": "nổi tiếng", "example": "My hometown has famous ski resorts.", "section": "Skills 2" },
    { "id": 51, "word": "snowboard", "ipa": "'snəʊ.bɔːrd", "type": "v", "meaning": "trượt tuyết", "example": "I'm into snowboarding and usually go to a nearby ski resorts with my parents at weekend.", "section": "Skills 2" },
    { "id": 52, "word": "balance", "ipa": "'bæləns", "type": "n", "meaning": "sự cân bằng", "example": "Snowboarding improves my overall health and balance.", "section": "Skills 2" },
    { "id": 53, "word": "muscle", "ipa": "'mʌsl", "type": "n", "meaning": "cơ bắp", "example": "Playing badminton improves my muscle strength.", "section": "Skills 2" },
    { "id": 54, "word": "strength", "ipa": "streŋkθ", "type": "n", "meaning": "sức mạnh", "example": "If a boy uses his strength to frighten weaker peers, he is a bully.", "section": "Skills 2" },
    { "id": 55, "word": "reduce stress", "ipa": "rɪ'djuːs stres", "type": "vp", "meaning": "giảm căng thẳng", "example": "Playing sport helps me reduce stress.", "section": "Skills 2" },

    { "id": 56, "word": "be good for", "ipa": "biː ɡʊd fɔː", "type": "phr", "meaning": "tốt cho", "example": "Lan thinks puzzles are good for the brain.", "section": "Looking Back" },
    { "id": 57, "word": "bracelet", "ipa": "'breɪslət", "type": "n", "meaning": "vòng tay", "example": "I can make many things myself such as paper flowers and bracelets.", "section": "Looking Back" },
    { "id": 58, "word": "patient", "ipa": "'peɪʃnt", "type": "adj", "meaning": "kiên nhẫn", "example": "I'm not fond of making models because I'm not patient.", "section": "Looking Back" },
    { "id": 59, "word": "do judo", "ipa": "duː 'dʒuːdəʊ", "type": "vp", "meaning": "tập võ judo", "example": "My friends are keen on doing judo.", "section": "Looking Back" },
    { "id": 60, "word": "make models", "ipa": "meɪk 'mɒd.əl", "type": "vp", "meaning": "làm mô hình", "example": "She is not into making models.", "section": "Looking Back" }
  ]
};
