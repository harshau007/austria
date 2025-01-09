import { Company } from "@/types/company";
import { ListRestart } from "lucide-react";

interface CompanyListProps {
  companies: Company[];
  onCompanySelect: (company: Company | null) => void;
  setSelectedRegion: (region: string | null) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onCompanySelect,
  setSelectedRegion,
}) => {
  return (
    <div className="shadow-md rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Companies</h2>
        <button
          onClick={() => setSelectedRegion(null)}
          className="hover:text-red-500 transition-colors duration-200 flex items-center"
          aria-label="Reset All Company Selections"
        >
          <ListRestart className="w-5 h-5" />
          <span className="ml-2 text-sm">Reset</span>
        </button>
      </div>
      <div className="overflow-y-auto max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[550px]">
        <ul className="space-y-2">
          {companies.map((company) => (
            <li
              key={company.id}
              className="border-b p-2 cursor-pointer hover:bg-white/10 transition-colors duration-200"
              onClick={() => onCompanySelect(company)}
            >
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-sm">{company.region}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyList;
