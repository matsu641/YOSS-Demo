"use client";
import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { Button, Card, DirectionBadge, Drawer } from "@/components/ui";
import type { RegionalResource } from "@/types";
export function ResourceMap({ resources }: { resources: RegionalResource[] }) {
  const [cat, setCat] = useState("すべて"),
    [selected, setSelected] = useState<RegionalResource | null>(null),
    cats = [
      "すべて",
      "学習支援",
      "子ども食堂",
      "居場所",
      "福祉相談",
      "医療",
      "行政",
      "その他",
    ],
    list =
      cat === "すべて"
        ? resources
        : resources.filter((r) => r.category === cat);
  return (
    <>
      <div className="active-chips">
        {cats.map((c) => (
          <button className="active-chip" key={c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="resource-layout">
        <div className="fake-map" aria-label="架空の地図表示">
          <div className="fake-roads" />
          <span className="school-pin">YOSSデモ小学校</span>
          {list.map((r, i) => (
            <button
              aria-label={`${r.name}を表示`}
              className="map-pin"
              style={{
                left: `${r.mapPosition.x}%`,
                top: `${r.mapPosition.y}%`,
              }}
              key={r.id}
              onClick={() => setSelected(r)}
            >
              <MapPin />
              <b>{i + 1}</b>
            </button>
          ))}
        </div>
        <div className="resource-list">
          {list.map((r) => (
            <Card
              className="clickable"
              key={r.id}
              onClick={() => setSelected(r)}
            >
              <span className="badge status-info">{r.category}</span>
              <h3>{r.name}</h3>
              <p>{r.address}</p>
              <small>学校から {r.distanceFromSchoolKm.toFixed(1)}km</small>
            </Card>
          ))}
        </div>
      </div>
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="地域資源の詳細"
      >
        {selected && (
          <div>
            <span className="badge status-info">{selected.category}</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <dl>
              <dt>住所</dt>
              <dd>{selected.address}</dd>
              <dt>電話番号</dt>
              <dd>
                <Phone size={14} />
                {selected.phone}
              </dd>
              <dt>利用時間</dt>
              <dd>{selected.openingHours}</dd>
              <dt>学校からの距離</dt>
              <dd>{selected.distanceFromSchoolKm.toFixed(1)}km</dd>
            </dl>
            <div>
              {selected.supportedDirections.map((d) => (
                <DirectionBadge key={d} direction={d} />
              ))}
            </div>
            <Button disabled title="デモ版では利用できません">
              外部地図で開く（デモでは利用不可）
            </Button>
          </div>
        )}
      </Drawer>
    </>
  );
}
