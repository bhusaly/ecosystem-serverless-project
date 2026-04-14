import { Pencil, Trash2 } from "lucide-react";

interface Business {
  businessId: string;
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
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {business.name}
          </h3>

          <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#00B000]/10 text-[#00B000] text-xs font-medium rounded-full">
            {business.category}
          </span>
        </div>

        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          
          <button
            onClick={() => onEdit(business)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#00B000] hover:bg-[#00B000]/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(business.businessId)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
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