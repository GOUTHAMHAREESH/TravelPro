
/**
 * Simple text search filter for admin tables.
 * Filters list by searchText (case-insensitive) using the provided getSearchableText function.
 */
export default function TableFilters({ searchText, setSearchText, placeholder = 'Search...' }) {
  return (
    <div className="table-filters table-filters-simple">
      <div className="filter-item">
        <label>Filter</label>
        <input
          type="text"
          placeholder={placeholder}
          value={searchText || ''}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  );
}

/** Helper: filter list by text (checks multiple fields) */
export function filterListByText(list, searchText, fields) {
  if (!list) return [];
  const txt = (searchText || '').trim().toLowerCase();
  if (!txt) return list;
  return list.filter((item) =>
    fields.some((f) => {
      const v = item[f];
      return v != null && String(v).toLowerCase().includes(txt);
    })
  );
}

/** Helper: filter by select (exact match on field) */
export function filterListBySelect(list, filterValue, field) {
  if (!list) return [];
  if (!filterValue) return list;
  return list.filter((item) => item[field] == filterValue);
}

/** Helper: filter by date range (field between fromDate and toDate) */
export function filterListByDateRange(list, fromDate, toDate, dateField) {
  if (!list) return [];
  if (!fromDate && !toDate) return list;
  return list.filter((item) => {
    const d = item[dateField];
    if (!d) return false;
    const dt = new Date(d).getTime();
    if (fromDate && dt < new Date(fromDate).getTime()) return false;
    if (toDate && dt > new Date(toDate).getTime()) return false;
    return true;
  });
}
