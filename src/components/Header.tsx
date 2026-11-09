import LeftNav from "@/features/header/pages/LeftNav";
import MidIcons from "@/features/header/pages/MidIcons";
import SearchBar from "@/features/header/pages/Search";
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        <LeftNav />
        <MidIcons />
        <SearchBar />
      </div>
    </header>
  );
}
