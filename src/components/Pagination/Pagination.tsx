import Link from 'next/link';

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, '...', current - 1, current, current + 1, '...', total];
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const pageUrl = (p: number) => p === 1 ? basePath : `${basePath}?page=${p}`;

  return (
    <div className="flex items-center justify-center gap-2 mt-10 text-[15px] text-[#3a4954] dark:text-[#e2e8f0]">
      {currentPage > 1 ? (
        <Link href={pageUrl(currentPage - 1)} className="px-1 hover:opacity-60 transition-opacity">
          &lt;
        </Link>
      ) : (
        <span className="px-1 text-[#c0c0c0] dark:text-[#4b5563]">&lt;</span>
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-[#909090]">···</span>
        ) : (
          <Link
            key={page}
            href={pageUrl(page)}
            className={`px-1 hover:opacity-60 transition-opacity ${
              page === currentPage ? 'font-bold underline underline-offset-4' : ''
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={pageUrl(currentPage + 1)} className="px-1 hover:opacity-60 transition-opacity">
          &gt;
        </Link>
      ) : (
        <span className="px-1 text-[#c0c0c0] dark:text-[#4b5563]">&gt;</span>
      )}
    </div>
  );
}
