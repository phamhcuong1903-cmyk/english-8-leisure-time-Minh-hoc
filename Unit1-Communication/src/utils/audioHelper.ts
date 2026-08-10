// Sample script for Communication lesson in Grade 6-9 English curriculum
export const SAMPLE_COMMUNICATION_TEXT = 
  "Good morning students. Today we are going to learn about effective communication skills. " +
  "Communication is the process of sharing information, thoughts, and feelings between people. " +
  "There are two main types of communication: verbal communication and non-verbal communication. " +
  "Verbal communication involves speaking and writing, while non-verbal communication includes body language, facial expressions, and eye contact. " +
  "To communicate effectively, you should listen actively, speak clearly, and respect others when they are talking. " +
  "Good communication helps us make friends and understand each other better.";

export class DictationAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private onTimeUpdateCallback: ((currentTime: number, duration: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onErrorCallback: ((err: string) => void) | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private isUsingSpeech: boolean = false;
  private speechStartTime: number = 0;
  private speechInterval: any = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentRate: number = 1.0;

  constructor() {
    this.initAudio();
    this.initVoices();
  }

  private initVoices() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  private initAudio() {
    try {
      this.audio = new Audio('/Communication.mp3');
      
      this.audio.addEventListener('timeupdate', () => {
        if (this.audio && !this.isUsingSpeech && this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.audio.currentTime, this.audio.duration || 0);
        }
      });

      this.audio.addEventListener('ended', () => {
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      });

      this.audio.addEventListener('error', () => {
        // Communication.mp3 missing or return index.html 404/decode error -> Fallback to speech synthesis
        this.isUsingSpeech = true;
      });
    } catch (e) {
      this.isUsingSpeech = true;
    }
  }

  public playFromStart(rate: number = 1.0, onStart?: () => void) {
    this.currentRate = rate;
    this.stop();

    if (this.audio && !this.isUsingSpeech) {
      this.audio.currentTime = 0;
      this.audio.playbackRate = rate;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (onStart) onStart();
          })
          .catch((err) => {
            console.warn('HTML5 Audio play failed, falling back to Speech Synthesis:', err);
            this.isUsingSpeech = true;
            this.playSpeechFromStart(rate, onStart);
          });
      }
    } else {
      this.playSpeechFromStart(rate, onStart);
    }
  }

  private playSpeechFromStart(rate: number, onStart?: () => void) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (this.speechInterval) clearInterval(this.speechInterval);

      // Make sure speech synthesis is unpaused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      this.speechUtterance = new SpeechSynthesisUtterance(SAMPLE_COMMUNICATION_TEXT);
      this.speechUtterance.lang = 'en-US';
      this.speechUtterance.rate = rate;
      this.speechUtterance.pitch = 1.0;

      // Select best available English voice
      if (this.voices.length === 0) {
        this.voices = window.speechSynthesis.getVoices();
      }
      const engVoice = this.voices.find(
        v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('US') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      ) || this.voices.find(v => v.lang.startsWith('en'));

      if (engVoice) {
        this.speechUtterance.voice = engVoice;
      }

      // Calculate total duration in seconds based on text word count and playback rate
      const wordCount = SAMPLE_COMMUNICATION_TEXT.split(/\s+/).length;
      // Average English reading speed is ~2.5 words per second at 1.0x rate
      const estimatedDuration = Math.max(10, (wordCount / (2.5 * rate)));
      this.speechStartTime = Date.now();

      this.speechUtterance.onstart = () => {
        if (onStart) onStart();
        this.speechInterval = setInterval(() => {
          const elapsed = (Date.now() - this.speechStartTime) / 1000;
          if (this.onTimeUpdateCallback) {
            this.onTimeUpdateCallback(Math.min(elapsed, estimatedDuration), estimatedDuration);
          }
        }, 100);
      };

      this.speechUtterance.onend = () => {
        if (this.speechInterval) clearInterval(this.speechInterval);
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(estimatedDuration, estimatedDuration);
        }
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      this.speechUtterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (this.speechInterval) clearInterval(this.speechInterval);
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      window.speechSynthesis.speak(this.speechUtterance);

      // Webkit workaround: SpeechSynthesis can pause unexpectedly after ~15s
      const resumeTimer = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(resumeTimer);
        }
      }, 10000);

    } else {
      if (this.onErrorCallback) {
        this.onErrorCallback('Trình duyệt không hỗ trợ phát âm thanh.');
      }
    }
  }

  public pause() {
    if (this.audio && !this.isUsingSpeech) {
      this.audio.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      if (this.speechInterval) clearInterval(this.speechInterval);
    }
  }

  public resume() {
    if (this.audio && !this.isUsingSpeech) {
      this.audio.play();
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (this.speechInterval) clearInterval(this.speechInterval);
    }
  }

  public setRate(rate: number) {
    this.currentRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    if (this.speechUtterance) {
      this.speechUtterance.rate = rate;
    }
  }

  public loadCustomAudioFile(file: File) {
    this.stop();
    const objectUrl = URL.createObjectURL(file);
    if (!this.audio) {
      this.audio = new Audio();
    }
    this.audio.src = objectUrl;
    this.isUsingSpeech = false;
    this.audio.load();
  }

  public loadCustomAudioUrl(url: string) {
    this.stop();
    if (!this.audio) {
      this.audio = new Audio();
    }
    this.audio.src = url;
    this.isUsingSpeech = false;
    this.audio.load();
  }

  public setMode(useSpeech: boolean) {
    this.isUsingSpeech = useSpeech;
  }

  public getIsUsingSpeech(): boolean {
    return this.isUsingSpeech;
  }

  public rewind(seconds: number = 5) {
    if (this.audio && !this.isUsingSpeech) {
      this.audio.currentTime = Math.max(0, this.audio.currentTime - seconds);
    } else {
      // For speech synthesis, restart with small offset or restart
      this.playSpeechFromStart(this.currentRate);
    }
  }

  public setCallbacks(
    onTimeUpdate: (currentTime: number, duration: number) => void,
    onEnd: () => void,
    onError?: (err: string) => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndCallback = onEnd;
    this.onErrorCallback = onError || null;
  }
}

