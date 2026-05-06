import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { articles } from "@/data/articles";

// ─────────────────────────────────────────────────────────────────────────────
// Flavor connection data per article food
// ─────────────────────────────────────────────────────────────────────────────
export interface FlavorConnection {
  food: string;
  shared_compounds: number;
  reason: string;
  category: "fruit" | "dairy" | "meat" | "vegetable" | "drink" | "spice" | "grain";
}

const FLAVOR_DATA: Record<string, FlavorConnection[]> = {
  Chocolate: [
    { food: "Blue Cheese", shared_compounds: 73, reason: "Both contain pyrazines", category: "dairy" },
    { food: "Red Wine", shared_compounds: 58, reason: "Shared tannins and phenols", category: "drink" },
    { food: "Espresso", shared_compounds: 47, reason: "Roasting creates similar Maillard compounds", category: "drink" },
    { food: "Strawberry", shared_compounds: 35, reason: "Shared fruity esters", category: "fruit" },
    { food: "Beef", shared_compounds: 28, reason: "Umami glutamates overlap", category: "meat" },
  ],
  Peppers: [
    { food: "Chocolate", shared_compounds: 42, reason: "Aztecs combined them — capsaicin enhances cocoa", category: "grain" },
    { food: "Tomato", shared_compounds: 38, reason: "Both nightshades, shared terpenes", category: "vegetable" },
    { food: "Mango", shared_compounds: 31, reason: "Fruity esters balance the heat", category: "fruit" },
    { food: "Cumin", shared_compounds: 55, reason: "Shared terpenoid compounds", category: "spice" },
    { food: "Lime", shared_compounds: 29, reason: "Citrus cuts capsaicin intensity", category: "fruit" },
  ],
  Vanilla: [
    { food: "Butter", shared_compounds: 62, reason: "Diacetyl and lactones overlap", category: "dairy" },
    { food: "Peach", shared_compounds: 55, reason: "Shared lactone compounds", category: "fruit" },
    { food: "Clove", shared_compounds: 48, reason: "Eugenol present in both", category: "spice" },
    { food: "Rum", shared_compounds: 44, reason: "Fermentation creates shared esters", category: "drink" },
    { food: "Tobacco", shared_compounds: 37, reason: "Coumarin compounds in common", category: "grain" },
  ],
  Salt: [
    { food: "Caramel", shared_compounds: 71, reason: "Salt amplifies sweetness via contrast", category: "grain" },
    { food: "Watermelon", shared_compounds: 45, reason: "Mineral notes enhance fruit", category: "fruit" },
    { food: "Anchovy", shared_compounds: 68, reason: "Both are umami amplifiers", category: "meat" },
    { food: "Butter", shared_compounds: 52, reason: "Salt is essential to butter's flavor", category: "dairy" },
    { food: "Dark Beer", shared_compounds: 39, reason: "Mineral content parallels", category: "drink" },
  ],
  Avocado: [
    { food: "Lime", shared_compounds: 58, reason: "Terpene compounds complement perfectly", category: "fruit" },
    { food: "Cilantro", shared_compounds: 51, reason: "Shared aldehydes", category: "vegetable" },
    { food: "Sesame", shared_compounds: 44, reason: "Fatty acid profiles overlap", category: "grain" },
    { food: "Mango", shared_compounds: 38, reason: "Tropical terpenes in common", category: "fruit" },
    { food: "Smoked Salmon", shared_compounds: 33, reason: "Fatty richness creates harmony", category: "meat" },
  ],
  Tea: [
    { food: "Jasmine", shared_compounds: 67, reason: "Floral linalool compounds", category: "vegetable" },
    { food: "Dark Chocolate", shared_compounds: 54, reason: "Shared polyphenols and tannins", category: "grain" },
    { food: "Bergamot", shared_compounds: 61, reason: "Citrus terpenes — basis of Earl Grey", category: "fruit" },
    { food: "Milk", shared_compounds: 42, reason: "Casein binds tannins — classic pairing", category: "dairy" },
    { food: "Ginger", shared_compounds: 35, reason: "Shared spicy phenolic compounds", category: "spice" },
  ],
  Pizza: [
    { food: "Tomato", shared_compounds: 72, reason: "Lycopene and glutamates define the base", category: "vegetable" },
    { food: "Mozzarella", shared_compounds: 65, reason: "Milk proteins caramelize together", category: "dairy" },
    { food: "Basil", shared_compounds: 58, reason: "Linalool and eugenol complement perfectly", category: "vegetable" },
    { food: "Anchovy", shared_compounds: 49, reason: "Umami amplification", category: "meat" },
    { food: "Red Wine", shared_compounds: 41, reason: "Acidity and tannins match tomato", category: "drink" },
  ],
  Bread: [
    { food: "Butter", shared_compounds: 69, reason: "Maillard products match perfectly", category: "dairy" },
    { food: "Honey", shared_compounds: 55, reason: "Fermentation esters overlap", category: "grain" },
    { food: "Beer", shared_compounds: 72, reason: "Both use yeast fermentation — nearly identical compounds", category: "drink" },
    { food: "Cheese", shared_compounds: 48, reason: "Lactic acid bacteria create shared notes", category: "dairy" },
    { food: "Olive Oil", shared_compounds: 43, reason: "Fatty aldehydes complement", category: "grain" },
  ],
  Sushi: [
    { food: "Wasabi", shared_compounds: 61, reason: "Isothiocyanates cut through fish fat", category: "spice" },
    { food: "Soy Sauce", shared_compounds: 74, reason: "Umami glutamates amplify fish", category: "grain" },
    { food: "Cucumber", shared_compounds: 45, reason: "Aldehydes complement seafood freshness", category: "vegetable" },
    { food: "Avocado", shared_compounds: 39, reason: "Fatty acids mirror tuna's richness", category: "fruit" },
    { food: "Sake", shared_compounds: 52, reason: "Rice fermentation esters match", category: "drink" },
  ],
  Banana: [
    { food: "Rum", shared_compounds: 68, reason: "Isoamyl acetate — the banana ester — is in both", category: "drink" },
    { food: "Vanilla", shared_compounds: 55, reason: "Shared fruity esters", category: "spice" },
    { food: "Peanut Butter", shared_compounds: 47, reason: "Fatty richness and sweetness harmonize", category: "grain" },
    { food: "Cardamom", shared_compounds: 41, reason: "Floral terpenes complement", category: "spice" },
    { food: "Clove", shared_compounds: 36, reason: "Eugenol notes in ripe banana", category: "spice" },
  ],
};

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  fruit: "#F97316",    // orange
  dairy: "#EAB308",    // yellow
  meat: "#EF4444",     // red
  vegetable: "#22C55E", // green
  drink: "#3B82F6",    // blue
  spice: "#A855F7",    // purple
  grain: "#6B7280",    // gray
};

interface FlavorWebProps {
  food: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function FlavorWeb({ food }: FlavorWebProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  const connections = FLAVOR_DATA[food] ?? [];

  useEffect(() => {
    if (!svgRef.current || connections.length === 0) return;

    const width = svgRef.current.clientWidth || 500;
    const height = 380;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // ── Nodes ──────────────────────────────────────────────────────────────
    type NodeDatum = {
      id: string;
      isCenter: boolean;
      shared_compounds?: number;
      reason?: string;
      category?: string;
      x?: number;
      y?: number;
      fx?: number | null;
      fy?: number | null;
    };

    const nodes: NodeDatum[] = [
      { id: food, isCenter: true, fx: centerX, fy: centerY },
      ...connections.map(c => ({
        id: c.food,
        isCenter: false,
        shared_compounds: c.shared_compounds,
        reason: c.reason,
        category: c.category,
      })),
    ];

    type LinkDatum = { source: string; target: string; strength: number };
    const links: LinkDatum[] = connections.map(c => ({
      source: food,
      target: c.food,
      strength: c.shared_compounds / 100,
    }));

    // ── Force simulation ───────────────────────────────────────────────────
    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: d3.SimulationNodeDatum) => (d as NodeDatum).id)
          .distance(130)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collision", d3.forceCollide(50));

    // ── Links ──────────────────────────────────────────────────────────────
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(212,168,83,0.3)")
      .attr("stroke-width", (d: LinkDatum) => Math.max(1, d.strength * 5));

    // ── Tooltip ────────────────────────────────────────────────────────────
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "flavor-tooltip")
      .style("position", "fixed")
      .style("background", "hsl(24 15% 10%)")
      .style("border", "1px solid rgba(212,168,83,0.3)")
      .style("color", "hsl(36 25% 88%)")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", "0")
      .style("z-index", "9999")
      .style("max-width", "220px")
      .style("line-height", "1.5");

    // ── Node groups ────────────────────────────────────────────────────────
    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, NodeDatum>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            if (!d.isCenter) {
              d.fx = null;
              d.fy = null;
            }
          })
      );

    // Center node pulsing circle
    nodeGroup
      .filter((d: NodeDatum) => d.isCenter)
      .append("circle")
      .attr("r", 42)
      .attr("fill", "rgba(212,168,83,0.08)")
      .attr("stroke", "rgba(212,168,83,0.2)")
      .attr("stroke-width", 1)
      .style("animation", "pulse 2.5s ease-in-out infinite");

    // Main circles
    nodeGroup
      .append("circle")
      .attr("r", (d: NodeDatum) => {
        if (d.isCenter) return 34;
        const sc = d.shared_compounds ?? 30;
        return 16 + (sc / 100) * 18;
      })
      .attr("fill", (d: NodeDatum) => {
        if (d.isCenter) return "hsl(40 55% 42%)";
        return CATEGORY_COLORS[d.category ?? "grain"] + "cc";
      })
      .attr("stroke", (d: NodeDatum) =>
        d.isCenter ? "hsl(40 55% 65%)" : "rgba(255,255,255,0.15)"
      )
      .attr("stroke-width", (d: NodeDatum) => (d.isCenter ? 2 : 1));

    // Labels
    nodeGroup
      .append("text")
      .text((d: NodeDatum) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", (d: NodeDatum) => (d.isCenter ? "11px" : "9px"))
      .attr("font-weight", (d: NodeDatum) => (d.isCenter ? "700" : "500"))
      .attr("fill", (d: NodeDatum) =>
        d.isCenter ? "hsl(24 18% 4%)" : "white"
      )
      .style("pointer-events", "none");

    // Hover interactions
    nodeGroup
      .on("mouseover", (event: MouseEvent, d: NodeDatum) => {
        if (d.isCenter) return;
        tooltip
          .style("opacity", "1")
          .html(
            `<strong>${d.id}</strong> shares <strong style="color:hsl(40 55% 65%)">${d.shared_compounds}</strong> flavor compounds with ${food}<br/><em style="color:hsl(30 10% 55%)">${d.reason}</em>`
          );
      })
      .on("mousemove", (event: MouseEvent) => {
        tooltip
          .style("left", `${event.clientX + 12}px`)
          .style("top", `${event.clientY - 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", "0");
      })
      .on("click", (_event: MouseEvent, d: NodeDatum) => {
        if (d.isCenter) return;
        const match = articles.find(
          a => a.food.toLowerCase() === d.id.toLowerCase()
        );
        if (match) {
          navigate(`/article/${match.slug}`);
        } else {
          alert(`Coming soon: The history of ${d.id}`);
        }
      });

    // ── Tick ───────────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      link
        .attr("x1", (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) => {
          const s = d.source as NodeDatum;
          return s.x ?? 0;
        })
        .attr("y1", (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) => {
          const s = d.source as NodeDatum;
          return s.y ?? 0;
        })
        .attr("x2", (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) => {
          const t = d.target as NodeDatum;
          return t.x ?? 0;
        })
        .attr("y2", (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) => {
          const t = d.target as NodeDatum;
          return t.y ?? 0;
        });

      nodeGroup.attr(
        "transform",
        (d: NodeDatum) => `translate(${d.x ?? 0},${d.y ?? 0})`
      );
    });

    // Gentle floating idle animation after simulation settles
    simulation.on("end", () => {
      nodeGroup
        .filter((d: NodeDatum) => !d.isCenter)
        .each(function (d: NodeDatum, i: number) {
          d3.select(this)
            .select("circle:last-of-type")
            .transition()
            .duration(2000 + i * 300)
            .ease(d3.easeSinInOut)
            .attr("r", (16 + ((d.shared_compounds ?? 30) / 100) * 18) * 1.05)
            .transition()
            .duration(2000 + i * 300)
            .ease(d3.easeSinInOut)
            .attr("r", 16 + ((d.shared_compounds ?? 30) / 100) * 18)
            .on("end", function repeat(this: SVGCircleElement) {
              d3.select(this)
                .transition()
                .duration(2000 + i * 300)
                .ease(d3.easeSinInOut)
                .attr("r", (16 + ((d.shared_compounds ?? 30) / 100) * 18) * 1.05)
                .transition()
                .duration(2000 + i * 300)
                .ease(d3.easeSinInOut)
                .attr("r", 16 + ((d.shared_compounds ?? 30) / 100) * 18)
                .on("end", repeat);
            });
        });
    });

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [food, connections, navigate]);

  if (connections.length === 0) return null;

  return (
    <section className="my-16">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          The Flavor Web 🔴
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Foods that share hidden flavor compounds with{" "}
          <strong className="text-foreground">{food}</strong>
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: color }}
            />
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </span>
        ))}
      </div>

      {/* D3 Canvas */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: "hsl(24 15% 7%)",
          border: "1px solid rgba(212,168,83,0.12)",
        }}
      >
        <svg
          ref={svgRef}
          className="w-full"
          style={{ height: 380 }}
        />
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Drag nodes · Hover for details · Click to explore
      </p>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
}
