import { House } from "@/types/house";

interface HouseListProps {
  houses: House[];
  onHouseSelect: (company: House) => void;
}

const HouseList: React.FC<HouseListProps> = ({ houses, onHouseSelect }) => {
  return (
    <div className=" shadow-md rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Houses</h2>
      <div className="overflow-y-auto max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[550px]">
        <ul className="space-y-2">
          {houses.map((house) => (
            <li
              key={house.id}
              className="border-b p-2 cursor-pointer hover:bg-white/10 transition-colors duration-200"
              onClick={() => onHouseSelect(house)}
            >
              <h3 className="font-medium">{house.name}</h3>
              <p className="text-sm">{house.region}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HouseList;
