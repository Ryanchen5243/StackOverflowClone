export default function FilterButtons({ filterNewest, filterActive, filterUnanswered }) {
  function handleNewestButton() {
    filterNewest()
  }
  function handleActiveButton() {
    filterActive();
  }
  function handleUnansweredButton() {
    filterUnanswered();
  }
  return (
    <span id="filterBtns">
      <button onClick={handleNewestButton} id="newestBtn">Newest</button>
      <button onClick={handleActiveButton} id="activeBtn">Active</button>
      <button onClick={handleUnansweredButton} id="unansweredBtn">Unanswered</button>
    </span>
  );
}