export const handleScroll = (
  e: React.UIEvent<HTMLDivElement>,
  hasNext: boolean | undefined,
  isFetching: boolean,
  fetchNext: () => void,
) => {
  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  if (scrollHeight - scrollTop - clientHeight < 50 && hasNext && !isFetching) {
    fetchNext();
  }
};
