import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "What is Recipee?",
      answer: "Recipee is your AI-powered cooking companion that helps you turn ingredients into delicious meals. It provides personalized recipe recommendations, meal planning, and step-by-step cooking guidance."
    },
    {
      question: "How does the ingredient recognition work?",
      answer: "Simply take a photo of your ingredients, and our AI technology will identify them instantly. You can also input ingredients manually, record audio, or upload a video of your pantry."
    },
    {
      question: "Can I customize recipes based on dietary restrictions?",
      answer: "Yes! Recipee takes into account your dietary preferences, allergies, and restrictions to provide personalized recipe recommendations that suit your needs."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Recipee is available as a progressive web app (PWA), which means you can access it from any device and even install it on your phone for quick access."
    },
    {
      question: "How accurate are the nutritional information calculations?",
      answer: "Our nutritional information is calculated using a comprehensive database and AI analysis. While we strive for accuracy, we recommend consulting with a healthcare professional for specific dietary needs."
    }
  ];

  return (
    <section className="bg-accent py-16">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-primary/10"
              >
                <AccordionTrigger className="px-6 hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}