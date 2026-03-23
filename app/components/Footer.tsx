import SocialLinks from './SocialLinks';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {year} Matias Dure. All rights reserved.
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
