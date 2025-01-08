"use client";

import CompanyList from "@/components/CompanyList";
import HouseList from "@/components/HouseList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companies } from "@/data/companies";
import { houses } from "@/data/houses";
import { Company } from "@/types/company";
import { House } from "@/types/house";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicAustriaMap = dynamic(() => import("@/components/AustriaMap"), {
  ssr: false,
});

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [activeTab, setActiveTab] = useState<"company" | "house">("company");

  const filteredCompanies = selectedRegion
    ? companies.filter((company) => company.region === selectedRegion)
    : companies;

  const filteredHouses = selectedRegion
    ? houses.filter((house) => house.region === selectedRegion)
    : houses;

  const handleTabChange = (tab: "company" | "house") => {
    setActiveTab(tab);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-24">
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
          />
        </div>

        <div className="w-full lg:w-1/3 mt-4 lg:mt-0 space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              handleTabChange(value as "company" | "house")
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
              />
            </TabsContent>

            <TabsContent value="house">
              <HouseList
                houses={filteredHouses}
                onHouseSelect={setSelectedHouse}
              />
            </TabsContent>

            <TabsContent value="distance"></TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
