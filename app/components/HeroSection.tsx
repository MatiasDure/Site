import SocialLinks from './SocialLinks';

export default function HeroSection() {
  return (
    <section className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
        Matias Dure
      </h1>
      <p className="mt-3 text-lg font-medium text-zinc-600 dark:text-zinc-400">
        Software Engineer
      </p>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
        I build things across the stack — from interactive web experiences and mobile apps to games and embedded systems. Here you can explore all my work across domains.
      </p>
      <SocialLinks className="mt-6" />
    </section>
  );
}
