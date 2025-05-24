import React from "react";

const Hero = () => {
  return (
    <section className="relative bg-[url('/images/jascent-leung-CubSQS4iYEE-unsplash.jpg')] bg-cover bg-center lg:h-[60dvh] h-[80dvh] flex items-center justify-center">
      {/* Dark overlay to improve text visibility on the background image */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content container */}
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Elevate Your Style
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Discover our premium collection of fashion and accessories designed
          for the modern lifestyle
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-white/90 transition duration-300">
            Shop Now
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
