"use client";

import CompanyList from "@/components/CompanyList";
import HouseList from "@/components/HouseList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { companies } from "@/data/companies";
import { houses } from "@/data/houses";
import { railways } from "@/data/railways";
import { universities } from "@/data/universities";
import { Company } from "@/types/company";
import { House } from "@/types/house";
import { Railway } from "@/types/railway";
import { University } from "@/types/university";
import { Search, TrainFront } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicAustriaMap = dynamic(() => import("@/components/AustriaMap"), {
  ssr: false,
});

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [fromLocation, setFromLocation] = useState<House | Railway>(houses[0]);
  const [isTrainActive, setIsTrainActive] = useState(false);
  const [toLocation, setToLocation] = useState<University>(universities[0]);
  const [activeTab, setActiveTab] = useState<"company" | "house" | "distance">(
    "company"
  );
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [toSearchQuery, setToSearchQuery] = useState("");

  const filteredCompanies = selectedRegion
    ? companies.filter((company) => company.region === selectedRegion)
    : companies;

  const filteredHouses = selectedRegion
    ? houses.filter((house) => house.region === selectedRegion)
    : houses;

  const handleTabChange = (tab: "company" | "house" | "distance") => {
    setActiveTab(tab);
  };

  const handleFromLocationChange = (value: string) => {
    const [type, id] = value.split("-");
    if (type === "house") {
      setFromLocation(houses.find((h) => h.id.toString() === id) || houses[0]);
    } else if (type === "railway") {
      setFromLocation(
        railways.find((r) => r.id.toString() === id) || railways[0]
      );
    }
  };

  const filteredFromLocations = [...houses, ...railways].filter((location) =>
    location.name.toLowerCase().includes(fromSearchQuery.toLowerCase())
  );

  const filteredToLocations = universities.filter((university) =>
    university.name.toLowerCase().includes(toSearchQuery.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
        {activeTab === "company" ? "Companies" : "Houses"} in Austria
      </h1>
      <div className="flex flex-col lg:flex-row w-full gap-6">
        <div className="w-full lg:w-2/3 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <DynamicAustriaMap
            data={activeTab === "company" ? companies : houses}
            onRegionSelect={setSelectedRegion}
            selectedData={
              activeTab === "company" ? selectedCompany : selectedHouse
            }
            tab={activeTab}
            toLat={toLocation?.lat}
            toLong={toLocation?.long}
            fromLat={fromLocation?.lat}
            fromLong={fromLocation?.long}
            isTrainActive={isTrainActive}
          />
        </div>

        <div className="w-full lg:w-1/3 mt-4 lg:mt-0 space-y-4">
          <Toggle onClick={() => setIsTrainActive(!isTrainActive)}>
            <TrainFront />
          </Toggle>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              handleTabChange(value as "company" | "house" | "distance")
            }
          >
            <TabsList className="flex justify-center gap-4">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="house">House</TabsTrigger>
              <TabsTrigger value="distance">Distance</TabsTrigger>
            </TabsList>

            <TabsContent value="company">
              <CompanyList
                companies={filteredCompanies}
                onCompanySelect={setSelectedCompany}
                setSelectedRegion={setSelectedRegion}
              />
            </TabsContent>

            <TabsContent value="house">
              <HouseList
                houses={filteredHouses}
                onHouseSelect={setSelectedHouse}
                setSelectedRegion={setSelectedRegion}
              />
            </TabsContent>

            <TabsContent value="distance">
              <div>
                <Label
                  htmlFor="from-location"
                  className="block text-sm font-medium text-gray-700"
                >
                  From
                </Label>
                <Select
                  onValueChange={handleFromLocationChange}
                  defaultValue={`house-${fromLocation.id}`}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select From Location" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-40 overflow-auto">
                    <div className="flex items-center px-3 pb-2">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <Input
                        placeholder="Search locations..."
                        className="h-8 w-full bg-transparent focus:outline-none focus:ring-0"
                        value={fromSearchQuery}
                        onChange={(e) => setFromSearchQuery(e.target.value)}
                      />
                    </div>
                    <SelectGroup>
                      <SelectLabel>Houses</SelectLabel>
                      {filteredFromLocations
                        .filter(
                          (location): location is House => "region" in location
                        )
                        .map((house) => (
                          <SelectItem
                            key={`house-${house.id}`}
                            value={`house-${house.id}`}
                          >
                            {house.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                    {isTrainActive && (
                      <SelectGroup>
                        <SelectLabel>Transport</SelectLabel>
                        {filteredFromLocations
                          .filter(
                            (location): location is Railway =>
                              !("region" in location)
                          )
                          .map((station) => (
                            <SelectItem
                              key={`railway-${station.id}`}
                              value={`railway-${station.id}`}
                            >
                              {station.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <Label
                  htmlFor="to-location"
                  className="block text-sm font-medium text-gray-700"
                >
                  To
                </Label>
                <Select
                  onValueChange={(value) =>
                    setToLocation(
                      universities.find((u) => u.id.toString() === value) ||
                        universities[0]
                    )
                  }
                  defaultValue={toLocation.id.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select To Location" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-40 overflow-auto">
                    <div className="flex items-center px-3 pb-2">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <Input
                        placeholder="Search universities..."
                        className="h-8 w-full bg-transparent focus:outline-none focus:ring-0"
                        value={toSearchQuery}
                        onChange={(e) => setToSearchQuery(e.target.value)}
                      />
                    </div>
                    <SelectGroup>
                      <SelectLabel>Universities</SelectLabel>
                      {filteredToLocations.map((university) => (
                        <SelectItem
                          key={university.id}
                          value={university.id.toString()}
                        >
                          {university.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
