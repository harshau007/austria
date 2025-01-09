"use client";

import CompanyList from "@/components/CompanyList";
import HouseList from "@/components/HouseList";
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
import { companies } from "@/data/companies";
import { houses } from "@/data/houses";
import { universities } from "@/data/universities";
import { Company } from "@/types/company";
import { House } from "@/types/house";
import { University } from "@/types/university";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicAustriaMap = dynamic(() => import("@/components/AustriaMap"), {
  ssr: false,
});

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [fromLocation, setFromLocation] = useState<House | null>(houses[0]);
  const [toLocation, setToLocation] = useState<University | null>(
    universities[0]
  );
  const [activeTab, setActiveTab] = useState<"company" | "house" | "distance">(
    "company"
  );

  const filteredCompanies = selectedRegion
    ? companies.filter((company) => company.region === selectedRegion)
    : companies;

  const filteredHouses = selectedRegion
    ? houses.filter((house) => house.region === selectedRegion)
    : houses;

  const handleTabChange = (tab: "company" | "house" | "distance") => {
    setActiveTab(tab);
  };

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
          />
        </div>

        <div className="w-full lg:w-1/3 mt-4 lg:mt-0 space-y-4">
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
                  onValueChange={(value) =>
                    setFromLocation(
                      houses.find((h) => h.id.toString() === value) || null
                    )
                  }
                  defaultValue={fromLocation?.id.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select From Location" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-40 overflow-auto">
                    <SelectGroup>
                      <SelectLabel>Houses</SelectLabel>
                      {houses.map((house) => (
                        <SelectItem key={house.id} value={house.id.toString()}>
                          {house.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    {/* <SelectGroup>
                      <SelectLabel>Transport</SelectLabel>
                      {austriaRailwayData.features.map((station) => (
                        <SelectItem
                          key={station.properties?.osm_id}
                          value={station.properties!.name!.toString()}
                        >
                          {station.properties?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup> */}
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
                        null
                    )
                  }
                  defaultValue={toLocation?.id.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select To Location" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-40 overflow-auto">
                    <SelectGroup>
                      <SelectLabel>Universities</SelectLabel>
                      {universities.map((university) => (
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
