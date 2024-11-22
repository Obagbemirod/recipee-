import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Home Chef",
    quote: "This app has transformed my meal planning. The AI suggestions are spot-on, and I love how it helps me reduce food waste!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    initials: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Busy Professional",
    quote: "The recipe suggestions based on my available ingredients are incredible. It's like having a personal chef in my pocket!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    initials: "MC"
  },
  {
    name: "Emma Davis",
    role: "Food Enthusiast",
    quote: "I've discovered so many new recipes and cooking techniques. The community features make it fun and engaging!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    initials: "ED"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
            What Our Users Say
          </h2>
          <p className="text-secondary/70 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their cooking experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="font-semibold text-secondary">{testimonial.name}</h3>
                  <p className="text-sm text-secondary/70">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="text-secondary/80 italic">
                "{testimonial.quote}"
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};