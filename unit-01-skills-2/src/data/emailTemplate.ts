export interface EmailTemplate {
  greeting: string;
  openingLine: string;
  prompt: string;
  sampleAnswer: string;
  closing: string;
}

export const emailTemplateData: EmailTemplate = {
  greeting: "Hi,",
  openingLine: "It's nice to hear from you again,",
  prompt: "Let me tell you about how I spend my free time.",
  sampleAnswer: "Let me tell you about how I spend my free time. When I finish all my homework, I often read books and listen to my favorite songs. On Saturday, I usually go swimming with my friends at a nearby pool. We also play football in the afternoon. On Sunday, I always help my mom with housework and cooking meals. Then I do DIY with my younger sister. How do you spend your free time? I'm looking forward to your reply.",
  closing: "Bye for now,"
};
