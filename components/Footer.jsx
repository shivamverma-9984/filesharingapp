export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {/* Social placeholders could go here */}
          <p className="text-sm text-gray-400 hover:text-gray-500 cursor-pointer">
            Privacy
          </p>
          <p className="text-sm text-gray-400 hover:text-gray-500 cursor-pointer">
            Terms
          </p>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Sharely Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
