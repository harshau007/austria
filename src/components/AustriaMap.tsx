"use client";

import austriaData from "@/data/austria-geojson.json";
import { Company } from "@/types/company";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

interface AustriaMapProps {
  companies: Company[];
  onRegionSelect: (region: string) => void;
  selectedCompany: Company | null;
}

const AustriaMap: React.FC<AustriaMapProps> = ({
  companies,
  onRegionSelect,
  selectedCompany,
}) => {
  const center: [number, number] = [47.5162, 14.5501];
  const zoom = 7;

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      const popupContent = `<strong>${feature.properties.name}</strong>`;
      const popup = L.popup().setContent(popupContent);

      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            fillColor: "#FFA500",
            fillOpacity: 0.7,
          });
          layer.bindPopup(popup).openPopup();
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle({
            fillColor: "#FD8D3C",
            fillOpacity: 0.1,
          });
          layer.closePopup();
        },
        click: () => onRegionSelect(feature.properties?.name),
      });
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={austriaData as FeatureCollection}
        onEachFeature={onEachFeature}
        style={() => ({
          fillColor: "#FD8D3C",
          weight: 2,
          opacity: 1,
          color: "black",
          dashArray: "3",
          fillOpacity: 0.1,
        })}
      />
      {companies.map((company) => (
        <CompanyMarker key={company.id} company={company} />
      ))}
      <MapController selectedCompany={selectedCompany} />
    </MapContainer>
  );
};

interface CompanyMarkerProps {
  company: Company;
}

const CompanyMarker: React.FC<CompanyMarkerProps> = ({ company }) => {
  const markerRef = useRef<L.CircleMarker>(null);

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      const popupContent = `
        <div className="p-4 min-w-[200px] rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2 text-gray-900">${company.name}</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Region:</span>
              <span className="text-sm text-gray-800">${company.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Sector:</span>
              <span className="text-sm text-gray-800">${company.sector}</span>
            </div>
          </div>
        </div>
      `;
      const popup = L.popup().setContent(popupContent);

      marker.on({
        mouseover: () => {
          marker.bindPopup(popup).openPopup();
        },
        mouseout: () => {
          marker.closePopup();
        },
      });
    }
  }, [company]);

  return (
    <CircleMarker
      ref={markerRef}
      center={[company.lat, company.long]}
      radius={5}
      fillColor="#FF0000"
      color="#000"
      weight={1}
      opacity={1}
      fillOpacity={0.8}
    />
  );
};

interface MapControllerProps {
  selectedCompany: Company | null;
}

const MapController: React.FC<MapControllerProps> = ({ selectedCompany }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCompany) {
      map.setView([selectedCompany.lat, selectedCompany.long], 10);
    }
  }, [selectedCompany, map]);

  return null;
};

export default AustriaMap;
