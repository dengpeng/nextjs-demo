export const ELLIPSIS = "ellipsis";

function* pageGenerator({
  current,
  total,
  boundary = 1,
}: {
  current: number;
  total: number;
  boundary?: number;
}) {
  const minSize = 3 + 2 * boundary + 2;
  const guardLeft = boundary + 1;
  const guardRight = total - boundary;

  for (let i = 1; i <= total; ++i) {
    if (total <= minSize || i <= guardLeft - 1 || i >= guardRight + 1) {
      yield i;
    } else if (i <= guardLeft) {
      yield current > guardLeft + 2 ? ELLIPSIS : i;
    } else if (i >= guardRight) {
      yield current < guardRight - 2 ? ELLIPSIS : i;
    } else if (
      Math.abs(current - i) < 2 ||
      (current <= guardLeft + 2 && i <= guardLeft + 3) ||
      (current >= guardRight - 2 && i >= guardRight - 3)
    ) {
      yield i;
    }
  }
}

export type UsePaginationProps = {
  currentPage: number;
  totalPages: number;
  boundary?: number;
};

export default function usePagination({
  currentPage,
  totalPages,
  boundary = 1,
}: UsePaginationProps) {
  const pages = Array.from(
    pageGenerator({ current: currentPage, total: totalPages, boundary }),
  );

  return {
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    range: pages,
  };
}
