const Controls = ({
    genreFilter,
    setGenreFilter,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy
  }) => {
    return (
      <div >
        <label>Filter by Genre:</label>
        <select onChange={(e) => setGenreFilter(e.target.value)} value={genreFilter}>
          <option value="">All</option>
          <option value="Classic">Classic</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
        </select>
  
        <label>Min Rating:</label>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          onChange={(e) => setRatingFilter(e.target.value)}
          value={ratingFilter}
          placeholder="Min Rating"
        />
  
        <label>Sort By:</label>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="publicationYear">Publication Year</option>
        </select>
      </div>
    );
  };
  
  export default Controls;
  