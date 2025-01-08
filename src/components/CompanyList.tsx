import { Company } from "@/types/company";

interface CompanyListProps {
  companies: Company[];
  onCompanySelect: (company: Company) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onCompanySelect,
}) => {
  return (
    <div className=" shadow-md rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Companies</h2>
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
