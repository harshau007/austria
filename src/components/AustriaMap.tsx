"use client";

import austriaData from "@/data/austria-geojson.json";
import { universities } from "@/data/universities";
import { getDistance } from "@/lib/utils";
import { Company } from "@/types/company";
import { House } from "@/types/house";
import { University } from "@/types/university";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

interface AustriaMapProps {
  data: Company[] | House[];
  onRegionSelect: (region: string) => void;
  selectedData: Company | House | null;
  tab: string;
  toLat: number | undefined;
  toLong: number | undefined;
  fromLat: number | undefined;
  fromLong: number | undefined;
}

const AustriaMap: React.FC<AustriaMapProps> = ({
  data,
  onRegionSelect,
  selectedData,
  tab,
  toLat,
  toLong,
  fromLat,
  fromLong,
}) => {
  const center: [number, number] = [47.5162, 14.5501];
  const zoom = 7;

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties?.name) {
      layer.on({
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
      ></GeoJSON>
      {data.map((item) => (
        <DataMarker key={item.id + item.lat} data={item} />
      ))}
      {universities.map((university) => (
        <UniversityMarker key={university.id} data={university} />
      ))}
      {tab === "distance" && (
        <DistanceLines
          toLat={toLat}
          toLong={toLong}
          fromLat={fromLat}
          fromLong={fromLong}
        />
      )}
      <MapController selectedData={selectedData} />
    </MapContainer>
  );
};

interface DataMarkerProps {
  data: Company | House;
}

const DataMarker: React.FC<DataMarkerProps> = ({ data }) => {
  const markerRef = useRef<L.CircleMarker>(null);

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      const popupContent = `
        <h3 class="text-lg font-bold mb-2 text-gray-900">${data.name}</h3>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">${
              data.sector ? "Sector:" : "Rent:"
            }</span>
            <span class="text-sm text-gray-800">${
              data.sector || "€" + data.rent + "/month"
            }</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-600">Url:</span>
            <a href="${
              data.url
            }" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-500 underline">${
        data.url
      }</a>
          </div>
        </div>
      `;
      const popup = L.popup().setContent(popupContent);

      marker.on({
        click: () => {
          marker.bindPopup(popup).openPopup();
        },
      });
    }
  }, [data]);

  return (
    <CircleMarker
      ref={markerRef}
      center={[data.lat, data.long]}
      radius={5}
      fillColor="#FF0000"
      color="#000"
      weight={1}
      opacity={1}
      fillOpacity={0.8}
    />
  );
};

interface UniversityMarkerProps {
  data: University;
}

const UniversityMarker: React.FC<UniversityMarkerProps> = ({ data }) => {
  const markerRef = useRef<L.CircleMarker>(null);

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      const popupContent = `
        <h3 class="text-lg font-bold mb-2 text-gray-900">${data.name}</h3>
        <div class="space-y-1">
      `;
      const popup = L.popup().setContent(popupContent);

      marker.on({
        click: () => {
          marker.bindPopup(popup).openPopup();
        },
      });
    }
  }, [data]);

  return (
    <CircleMarker
      ref={markerRef}
      center={[data.lat, data.long]}
      radius={5}
      fillColor="#4287f5"
      color="#000"
      weight={1}
      opacity={1}
      fillOpacity={0.8}
    />
  );
};

interface MapControllerProps {
  selectedData: Company | House | null;
}

const MapController: React.FC<MapControllerProps> = ({ selectedData }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedData) {
      map.setView([selectedData.lat, selectedData.long], 10);
    }
  }, [selectedData, map]);

  return null;
};

interface DistanceLinesProps {
  toLat: number | undefined;
  toLong: number | undefined;
  fromLat: number | undefined;
  fromLong: number | undefined;
}

const DistanceLines: React.FC<DistanceLinesProps> = ({
  toLat,
  toLong,
  fromLat,
  fromLong,
}) => {
  const distance = getDistance(toLat!, toLong!, fromLat!, fromLong!);
  return (
    <>
      <Polyline
        key={`${toLat}-${fromLong}`}
        positions={[
          [toLat!, toLong!],
          [fromLat!, fromLong!],
        ]}
        color="purple"
        weight={4}
        opacity={0.5}
        dashArray="5, 5"
      >
        <Tooltip permanent>
          <span>
            {/* {house.name} - {university.name} */}
            {distance.toFixed(2)} km
          </span>
        </Tooltip>
      </Polyline>
    </>
  );
};
export default AustriaMap;
