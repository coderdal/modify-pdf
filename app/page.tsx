import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10">
      <nav className="flex flex-col gap-2">
        <Link href="/remove-pdf-pages" className="bg-blue-500 text-white p-2 rounded-md">Remove PDF Pages</Link>
        <Link href="/rotate-pdf" className="bg-blue-500 text-white p-2 rounded-md">Rotate PDF Files</Link>
        <Link href="/extract-pdf-text" className="bg-blue-500 text-white p-2 rounded-md">Extract PDF Text</Link>
        <Link href="/merge-pdf" className="bg-blue-500 text-white p-2 rounded-md">Merge PDF Files</Link>
        <Link href="/add-page-number" className="bg-blue-500 text-white p-2 rounded-md">Add Page Numbers</Link>
      </nav>
    </div>
  );
}
