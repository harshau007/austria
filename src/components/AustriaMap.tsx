"use client";

import austriaData from "@/data/austria-geojson.json";
import austriaRailwayData from "@/data/railways-geojson.json";
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
  GeoJSON,
  MapContainer,
  Marker,
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
  isTrainActive: boolean;
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
  isTrainActive,
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
      />
      {isTrainActive && (
        <GeoJSON
          data={austriaRailwayData as FeatureCollection}
          style={() => ({
            color: "#333",
            weight: 2,
            opacity: 0.7,
          })}
          pointToLayer={(feature, latlng) => {
            if (
              feature.properties &&
              feature.properties.railway === "station"
            ) {
              return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
              }).bindPopup(feature.properties.name || "Unknown Station");
            }
            return L.marker(latlng);
          }}
          onEachFeature={(feature, layer) => {
            if (
              feature.properties &&
              feature.properties.railway === "station"
            ) {
              layer.on("click", () => {
                layer.openPopup();
              });
            }
          }}
        />
      )}
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
  const markerRef = useRef<L.Marker>(null);

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
    <Marker
      ref={markerRef}
      position={[data.lat, data.long]}
      icon={L.divIcon({
        className: "custom-marker",
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00ab14" width="24" height="24">
                 <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
               </svg>`,
        iconSize: [24, 24],
        iconAnchor: [12, 18],
      })}
    />
  );
};

interface UniversityMarkerProps {
  data: University;
}

const UniversityMarker: React.FC<UniversityMarkerProps> = ({ data }) => {
  const markerRef = useRef<L.Marker>(null);

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
    <Marker
      ref={markerRef}
      position={[data.lat, data.long]}
      icon={L.divIcon({
        className: "custom-marker",
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4287f5" width="24" height="24">
                 <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
               </svg>`,
        iconSize: [24, 24],
        iconAnchor: [12, 18],
      })}
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
      map.setView([selectedData.lat, selectedData.long], 20);
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
  const { walkingTime, runningTime } = CalculateTime(distance);

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
          <div>
            <span>{distance.toFixed(2)} km</span>
            <div className="flex items-center mt-1">
              {/* <Walking className="w-4 h-4 mr-2 text-blue-500" /> */}
              Walking: <span>{walkingTime}</span>
            </div>
            <div className="flex items-center mt-1">
              {/* <Running className="w-4 h-4 mr-2 text-green-500" /> */}
              Running: <span>{runningTime}</span>
            </div>
          </div>
        </Tooltip>
      </Polyline>
    </>
  );
};

const CalculateTime = (distanceKm: number) => {
  const walkingSpeed = 5; // in km/h
  const runningSpeed = 10; // in km/h

  const walkingTimeInHours = distanceKm / walkingSpeed;
  const runningTimeInHours = distanceKm / runningSpeed;

  const formatTime = (timeInHours: number): string => {
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  return {
    walkingTime: formatTime(walkingTimeInHours),
    runningTime: formatTime(runningTimeInHours),
  };
};

export default AustriaMap;
