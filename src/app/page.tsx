"use client";

import CompanyList from "@/components/CompanyList";
import companies from "@/data/companies.json";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Company } from "@/types/company";

const DynamicAustriaMap = dynamic(() => import("@/components/AustriaMap"), {
  ssr: false,
});

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = selectedRegion
    ? companies.filter((company) => company.region === selectedRegion)
    : companies;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">
        Companies in Austria
      </h1>
      <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 md:gap-8">
        <div className="w-full lg:w-2/3 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <DynamicAustriaMap
            companies={companies}
            onRegionSelect={setSelectedRegion}
            selectedCompany={selectedCompany}
          />
        </div>
        <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
          <CompanyList
            companies={filteredCompanies}
            onCompanySelect={setSelectedCompany}
          />
        </div>
      </div>
    </main>
  );
}
