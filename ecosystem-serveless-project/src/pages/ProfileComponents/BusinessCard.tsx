
interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
}


function BusinessCard({
  business,
  onEdit,
  onDelete,
}: {
  business: Business;
  onEdit: (b: Business) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm truncate">{business.name}</h3>
          <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#00B000]/10 text-[#00B000] text-xs font-medium rounded-full">
            {business.category}
          </span>
        </div>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(business)}
            title="Edit"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#00B000] hover:bg-[#00B000]/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(business.id)}
            title="Delete"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {business.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {business.description}
        </p>
      )}
      <button
        onClick={() => onEdit(business)}
        className="mt-1 w-full bg-[#00B000] hover:bg-[#009900] text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
      >
        View Details
      </button>
    </div>
  );
}

export default BusinessCard;
