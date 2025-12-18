import { type ChangeEvent, useMemo, useState } from "react";
import "./index.css";

type StatKey =
  | "strategy"
  | "focus"
  | "expression"
  | "collaboration"
  | "grit"
  | "adaptability";

type StatDefinition = {
  key: StatKey;
  label: string;
  description: string;
};

const STAT_DEFS: StatDefinition[] = [
  {
    key: "strategy",
    label: "Strategy",
    description:
      "The ability to zoom out, identify long-term goals, and anticipate challenges before they arrive.",
  },
  {
    key: "focus",
    label: "Focus",
    description:
      'The capacity to enter a "flow state," silencing distractions to produce high-quality, complex output.',
  },
  {
    key: "expression",
    label: "Expression",
    description:
      "The art of translating complex thoughts into clear, persuasive messages for any audience or medium.",
  },
  {
    key: "collaboration",
    label: "Collaboration",
    description:
      "The force multiplier effect—how effectively you share resources and elevate the performance of those around you.",
  },
  {
    key: "grit",
    label: "Grit",
    description:
      "The mental toughness to stay the course when solutions are elusive or technical hurdles become frustrating.",
  },
  {
    key: "adaptability",
    label: "Adaptability",
    description:
      "The speed at which you can unlearn old habits and retool your approach when market or project goals shift.",
  },
];

const TYPE_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Fire: {
    bg: "bg-gradient-to-r from-orange-500 to-red-500",
    border: "border-orange-400/70",
    text: "text-white",
  },
  Water: {
    bg: "bg-gradient-to-r from-sky-500 to-blue-600",
    border: "border-sky-400/70",
    text: "text-white",
  },
  Grass: {
    bg: "bg-gradient-to-r from-emerald-500 to-lime-500",
    border: "border-emerald-400/70",
    text: "text-slate-950",
  },
  Electric: {
    bg: "bg-gradient-to-r from-yellow-300 to-amber-400",
    border: "border-amber-300/80",
    text: "text-slate-950",
  },
  Psychic: {
    bg: "bg-gradient-to-r from-pink-500 to-rose-500",
    border: "border-pink-300/80",
    text: "text-white",
  },
  Ice: {
    bg: "bg-gradient-to-r from-cyan-400 to-sky-400",
    border: "border-cyan-300/80",
    text: "text-slate-950",
  },
  Dragon: {
    bg: "bg-gradient-to-r from-indigo-600 to-sky-500",
    border: "border-indigo-400/80",
    text: "text-white",
  },
  Dark: {
    bg: "bg-gradient-to-r from-slate-900 to-slate-800",
    border: "border-slate-700",
    text: "text-slate-50",
  },
  Fairy: {
    bg: "bg-gradient-to-r from-fuchsia-400 to-pink-400",
    border: "border-fuchsia-300/80",
    text: "text-slate-950",
  },
  Steel: {
    bg: "bg-gradient-to-r from-slate-400 to-slate-500",
    border: "border-slate-300/80",
    text: "text-slate-950",
  },
  Fighting: {
    bg: "bg-gradient-to-r from-orange-700 to-amber-700",
    border: "border-orange-500/80",
    text: "text-white",
  },
  Flying: {
    bg: "bg-gradient-to-r from-sky-300 to-indigo-400",
    border: "border-sky-200/80",
    text: "text-slate-950",
  },
  Poison: {
    bg: "bg-gradient-to-r from-violet-500 to-purple-600",
    border: "border-violet-400/80",
    text: "text-white",
  },
  Ground: {
    bg: "bg-gradient-to-r from-amber-700 to-yellow-700",
    border: "border-amber-500/80",
    text: "text-slate-950",
  },
  Rock: {
    bg: "bg-gradient-to-r from-stone-500 to-stone-600",
    border: "border-stone-400/80",
    text: "text-slate-50",
  },
  Bug: {
    bg: "bg-gradient-to-r from-lime-600 to-emerald-600",
    border: "border-lime-400/80",
    text: "text-slate-50",
  },
  Ghost: {
    bg: "bg-gradient-to-r from-indigo-800 to-violet-700",
    border: "border-indigo-500/80",
    text: "text-slate-50",
  },
  Normal: {
    bg: "bg-gradient-to-r from-slate-200 to-slate-300",
    border: "border-slate-300/80",
    text: "text-slate-900",
  },
};

const ALL_TYPES = Object.keys(TYPE_COLORS);

const SPECIES_OPTIONS = [
  "🐦 Bird Pokémon",
  "🐱 Cat Pokémon",
  "🐉 Dragon Pokémon",
  "🐟 Fish Pokémon",
  "🌻 Flower Pokémon",
  "🦎 Lizard Pokémon",
  "🐭 Mouse Pokémon",
  "🍄 Mushroom Pokémon",
  "🐍 Snake Pokémon",
  "🐢 Turtle Pokémon",
];

type AbilityGroup = {
  icon: string;
  label: string;
  abilities: {
    code: string;
    name: string;
    description: string;
  }[];
};

const ABILITY_GROUPS: AbilityGroup[] = [
  {
    icon: "🔋",
    label: "Execution & Flow",
    abilities: [
      {
        code: "technician",
        name: "Technician",
        description:
          'High proficiency in "low power" tasks; makes small, repetitive chores look effortless and high-quality.',
      },
      {
        code: "speed-boost",
        name: "Speed Boost",
        description:
          "Productivity steadily increases the longer a meeting or work session lasts.",
      },
      {
        code: "moxie",
        name: "Moxie",
        description:
          "Gains a burst of motivation and energy immediately after completing a major task or winning a deal.",
      },
    ],
  },
  {
    icon: "🧠",
    label: "Strategic & Mental",
    abilities: [
      {
        code: "inner-focus",
        name: "Inner Focus",
        description:
          'Immune to "flinching"; stays completely locked in even when Slack pings or interruptions fly in.',
      },
      {
        code: "own-tempo",
        name: "Own Tempo",
        description:
          'Cannot be "confused"; remains steady and clear-headed even when project directions are vague.',
      },
      {
        code: "compound-eyes",
        name: "Compound Eyes",
        description:
          'Increases "accuracy"; rarely misses a small detail, typo, or edge case in a project.',
      },
    ],
  },
  {
    icon: "🤝",
    label: "Synergy & Support",
    abilities: [
      {
        code: "friend-guard",
        name: "Friend Guard",
        description:
          'Reduces the "damage" (stress) taken by teammates when working on a shared project.',
      },
      {
        code: "battery",
        name: "Battery",
        description:
          'Passively raises the "Special Attack" (creative output) of all teammates working nearby.',
      },
      {
        code: "healer",
        name: "Healer",
        description:
          'High chance of "curing" a teammate\'s frustration or burnout just by talking to them.',
      },
    ],
  },
  {
    icon: "🛡️",
    label: "Resilience & Adaptability",
    abilities: [
      {
        code: "regenerator",
        name: "Regenerator",
        description:
          'Restores mental energy simply by "switching out" of a task and taking a short break.',
      },
      {
        code: "filter",
        name: "Filter",
        description:
          'Weakens the impact of "Super Effective" hits; turns harsh external criticism into manageable feedback.',
      },
      {
        code: "guts",
        name: "Guts",
        description:
          'Working power increases when things get tough (e.g., during a "Burn" or high-stress season).',
      },
    ],
  },
];

type StatState = Record<StatKey, number>;

const INITIAL_STATS: StatState = {
  strategy: 100,
  focus: 100,
  expression: 100,
  collaboration: 100,
  grit: 100,
  adaptability: 100,
};

type TrainerForm = {
  trainerName: string;
  pokemonName: string;
  pokedexEntry: string;
  species: string;
  ability: string;
  types: string[];
  imageBase64: string | null;
};

type ValidationErrors = {
  trainerName?: string;
  pokemonName?: string;
};

const POKEDEX_PLACEHOLDER =
  "This developer Pokémon channels focus and grit to ship delightful experiences on impossible deadlines.";

function App() {
  const [form, setForm] = useState<TrainerForm>({
    trainerName: "",
    pokemonName: "",
    pokedexEntry: "",
    species: SPECIES_OPTIONS[0] ?? "",
    ability: ABILITY_GROUPS[0]?.abilities[0]?.code ?? "",
    types: ["Fire"],
    imageBase64: null,
  });

  const [stats, setStats] = useState<StatState>(INITIAL_STATS);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const totalStats = useMemo(
    () =>
      (Object.values(stats) as number[]).reduce(
        (sum, value) => sum + (Number.isFinite(value) ? value : 0),
        0,
      ),
    [stats],
  );

  const remainingPoints = 600 - totalStats;

  const selectedAbility = useMemo(() => {
    for (const group of ABILITY_GROUPS) {
      const found = group.abilities.find(
        (ability) => ability.code === form.ability,
      );
      if (found) {
        return { group, ability: found };
      }
    }
    return null;
  }, [form.ability]);

  const imagePrompt = useMemo(() => {
    const pokemonName = form.pokemonName || "[Name]";
    const rawSpecies = form.species || "[Species Name]";
    // Strip emoji from species name
    const speciesName = rawSpecies.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "").trim();
    const type1 = form.types[0] || "[First Type]";
    const type2 = form.types[1];
    const appearanceText = type2
      ? `A ${speciesName} that embodies the ${type1} and ${type2} types.`
      : `A ${speciesName} that embodies the ${type1} type.`;

    return `A professional 2D vector illustration of a new Pokémon species called ${pokemonName}.

Appearance: ${appearanceText} Style: Official Ken Sugimori Pokémon art style, clean line art, soft cel-shading, high-quality character design. Background: Solid white background. Technical: Full body view, 2D flat illustration, no text, no 3D rendering, simple shapes, iconic silhouette.`;
  }, [form.pokemonName, form.species, form.types]);

  const pokedexPrompt = useMemo(() => {
    if (!form.pokemonName || !form.types[0] || !form.species || !form.ability) {
      return "Fill in Pokémon name, at least one type, species, and ability to generate a prompt.";
    }

    const name = form.pokemonName || "[NAME]";
    const type1 = form.types[0] || "[TYPE]";
    const type2 = form.types[1];
    const typeText = type2 ? `${type1} and ${type2}` : type1;
    const rawSpecies = form.species || "[SPECIES]";
    // Strip emoji from species name
    const speciesName = rawSpecies.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "").trim();

    // Get top 2 stats and lowest stat
    const statEntries = STAT_DEFS.map((stat) => ({
      key: stat.key,
      label: stat.label,
      value: stats[stat.key],
    }));

    // Sort by value (descending)
    const sortedStats = [...statEntries].sort((a, b) => b.value - a.value);
    const topStat1 = sortedStats[0]?.label || "[TOP STAT 1]";
    const topStat2 = sortedStats[1]?.label || "[TOP STAT 2]";
    const lowestStat = sortedStats[sortedStats.length - 1]?.label || "[LOWEST STAT]";

    const abilityName = selectedAbility?.ability.name || "[ABILITY NAME]";
    const abilityDescription = selectedAbility?.ability.description || "[ABILITY DESCRIPTION]";

    return `Write a single Pokédex-style sentence under 30 words for a human character named ${name}, who is a ${typeText} type ${speciesName}. Use their highest stats, ${topStat1} and ${topStat2}, to describe their professional strengths, and their lowest stat, ${lowestStat}, to define their focused personality. Integrate their ability, ${abilityName} (${abilityDescription}), to show how they behave in a work environment. The tone should be concise, professional, and evocative.`;
  }, [form.pokemonName, form.types, form.species, form.ability, stats, selectedAbility]);

  const handleBasicChange = (
    field: keyof TrainerForm,
    value: string | string[],
  ) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      // Live validation for name pairing
      if (field === "trainerName" || field === "pokemonName") {
        const trimmedTrainer = (
          field === "trainerName" ? (value as string) : next.trainerName
        ).trim();
        const trimmedPoke = (
          field === "pokemonName" ? (value as string) : next.pokemonName
        ).trim();

        const newErrors: ValidationErrors = {};

        if (!trimmedTrainer) {
          newErrors.trainerName = "Trainer name is required.";
        } else if (trimmedTrainer.split(/\s+/).length !== 1) {
          newErrors.trainerName =
            "Trainer name should be a single word (no spaces).";
        }

        if (trimmedPoke) {
          const firstTrainer = trimmedTrainer[0]?.toLowerCase();
          const lastTrainer =
            trimmedTrainer[trimmedTrainer.length - 1]?.toLowerCase();
          const firstPoke = trimmedPoke[0]?.toLowerCase();
          const lastPoke =
            trimmedPoke[trimmedPoke.length - 1]?.toLowerCase();

          if (firstTrainer && lastTrainer) {
            if (firstTrainer !== firstPoke || lastTrainer !== lastPoke) {
              newErrors.pokemonName =
                "First and last letters of the trainer and Pokémon names must match.";
            }
          }
        }

        setErrors((prevErrors) => ({
          ...prevErrors,
          trainerName: newErrors.trainerName,
          pokemonName: newErrors.pokemonName,
        }));
      }

      return next;
    });
  };

  const toggleType = (type: string) => {
    setForm((prev) => {
      const alreadySelected = prev.types.includes(type);
      if (alreadySelected) {
        return { ...prev, types: prev.types.filter((t) => t !== type) };
      }
      if (prev.types.length >= 2) {
        return { ...prev, types: [prev.types[1], type] };
      }
      return { ...prev, types: [...prev.types, type] };
    });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type. Please upload an image.");
      return;
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error("File size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      console.error("Error reading file.");
    };
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, imageBase64: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStatChange = (key: StatKey, rawValue: number) => {
    const value = Math.max(1, Math.min(255, Math.round(rawValue)));

    setStats((prev) => {
      const current = prev[key];
      const delta = value - current;
      if (delta === 0) return prev;

      const currentTotal = (Object.values(prev) as number[]).reduce(
        (sum, v) => sum + v,
        0,
      );
      const newTotal = currentTotal + delta;

      // Keep total capped at 600; allow going below (leaves spare points).
      if (newTotal > 600) {
        const allowedDelta = 600 - currentTotal;
        const adjusted = current + allowedDelta;
        if (allowedDelta <= 0) return prev;
        return {
          ...prev,
          [key]: adjusted,
        };
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const validate = (): boolean => {
    const nextErrors: ValidationErrors = {};

    const trimmedTrainer = form.trainerName.trim();
    if (!trimmedTrainer) {
      nextErrors.trainerName = "Trainer name is required.";
    } else if (trimmedTrainer.split(/\s+/).length !== 1) {
      nextErrors.trainerName =
        "Trainer name should be a single word (no spaces).";
    }

    const trimmedPoke = form.pokemonName.trim();
    if (!trimmedPoke) {
      nextErrors.pokemonName = "Pokémon name is required.";
    } else if (trimmedTrainer) {
      const firstTrainer = trimmedTrainer[0]?.toLowerCase();
      const lastTrainer =
        trimmedTrainer[trimmedTrainer.length - 1]?.toLowerCase();
      const firstPoke = trimmedPoke[0]?.toLowerCase();
      const lastPoke = trimmedPoke[trimmedPoke.length - 1]?.toLowerCase();

      if (firstTrainer !== firstPoke || lastTrainer !== lastPoke) {
        nextErrors.pokemonName =
          "First and last letters of the trainer and Pokémon names must match.";
      }
    }
    // Stats are allowed to be below 600; the UI and logic already prevent going above 600.

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleExportJson = () => {
    if (!validate()) return;

    const payload = {
      trainerName: form.trainerName.trim(),
      pokemonName: form.pokemonName.trim(),
      pokedexEntry: form.pokedexEntry.trim(),
      species: form.species,
      ability: form.ability,
      types: form.types,
      imageBase64: form.imageBase64,
      stats: {
        Strategy: stats.strategy,
        Focus: stats.focus,
        Expression: stats.expression,
        Collaboration: stats.collaboration,
        Grit: stats.grit,
        Adaptability: stats.adaptability,
        total: totalStats,
      },
    };

    const json = JSON.stringify(payload, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${payload.pokemonName || "pokeprofile"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes("json") && !file.name.endsWith(".json")) {
      console.error("Invalid file type. Please upload a JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      console.error("Error reading file.");
    };
    reader.onload = () => {
      try {
        if (typeof reader.result !== "string") {
          throw new Error("File content is not a string");
        }
        const parsed = JSON.parse(reader.result);
        
        // Validate parsed data structure
        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("Invalid JSON structure");
        }

        const nextForm: TrainerForm = {
          trainerName: typeof parsed.trainerName === "string" ? parsed.trainerName : "",
          pokemonName: typeof parsed.pokemonName === "string" ? parsed.pokemonName : "",
          pokedexEntry: typeof parsed.pokedexEntry === "string" ? parsed.pokedexEntry : "",
          species: typeof parsed.species === "string" && SPECIES_OPTIONS.includes(parsed.species)
            ? parsed.species
            : SPECIES_OPTIONS[0] ?? "",
          ability: typeof parsed.ability === "string"
            ? parsed.ability
            : ABILITY_GROUPS[0]?.abilities[0]?.code ?? "",
          types: Array.isArray(parsed.types) && parsed.types.length
            ? parsed.types
                .filter((t: unknown): t is string => typeof t === "string" && ALL_TYPES.includes(t))
                .slice(0, 2)
            : ["Fire"],
          imageBase64:
            typeof parsed.imageBase64 === "string" ? parsed.imageBase64 : null,
        };

        const nextStats: StatState = {
          strategy: typeof parsed.stats?.Strategy === "number" && parsed.stats.Strategy >= 1 && parsed.stats.Strategy <= 255
            ? Math.round(parsed.stats.Strategy)
            : INITIAL_STATS.strategy,
          focus: typeof parsed.stats?.Focus === "number" && parsed.stats.Focus >= 1 && parsed.stats.Focus <= 255
            ? Math.round(parsed.stats.Focus)
            : INITIAL_STATS.focus,
          expression: typeof parsed.stats?.Expression === "number" && parsed.stats.Expression >= 1 && parsed.stats.Expression <= 255
            ? Math.round(parsed.stats.Expression)
            : INITIAL_STATS.expression,
          collaboration: typeof parsed.stats?.Collaboration === "number" && parsed.stats.Collaboration >= 1 && parsed.stats.Collaboration <= 255
            ? Math.round(parsed.stats.Collaboration)
            : INITIAL_STATS.collaboration,
          grit: typeof parsed.stats?.Grit === "number" && parsed.stats.Grit >= 1 && parsed.stats.Grit <= 255
            ? Math.round(parsed.stats.Grit)
            : INITIAL_STATS.grit,
          adaptability: typeof parsed.stats?.Adaptability === "number" && parsed.stats.Adaptability >= 1 && parsed.stats.Adaptability <= 255
            ? Math.round(parsed.stats.Adaptability)
            : INITIAL_STATS.adaptability,
        };

        setForm(nextForm);
        setStats(nextStats);
      } catch (error) {
        console.error("Failed to import JSON:", error);
        // Could add user-facing error notification here
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950/95 bg-[radial-gradient(circle_at_top,_#1f2937_0,_#020617_55%,_#000_100%)] text-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 lg:py-10">
      <header className="flex flex-col gap-2 border-b border-slate-800 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400/90">
              POKÉPROFILE LAB
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-50 md:text-4xl">
              Build your personal Pokédex entry
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Inspired by the layout on <span className="font-semibold text-emerald-300">PokemonDB</span>, this lets you turn your skills into a custom Pokémon-style profile card.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="pill border-emerald-500/60 bg-emerald-600/10 text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live Preview
            </div>
            {/* Only Live Preview in header */}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)] xl:gap-8">
          {/* Left: Form panel */}
          <div className="card-surface flex flex-col gap-6 p-5 md:p-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                Trainer & Pokémon
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Start with a single-word trainer name, then match the first and
                last letters in your custom Pokémon.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="field-label">Trainer Name</label>
                  <input
                    type="text"
                    id="trainer-name"
                    value={form.trainerName}
                    onChange={(e) =>
                      handleBasicChange("trainerName", e.target.value)
                    }
                    placeholder="Ash"
                    aria-describedby={errors.trainerName ? "trainer-name-error" : "trainer-name-hint"}
                    aria-invalid={!!errors.trainerName}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <p id="trainer-name-hint" className="field-hint">
                    Must be a single word. We&apos;ll mirror its first and last
                    letters.
                  </p>
                  {errors.trainerName && (
                    <p id="trainer-name-error" className="text-[0.7rem] font-medium text-rose-300" role="alert">
                      {errors.trainerName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="field-label">Pokémon Name</label>
                  <input
                    type="text"
                    id="pokemon-name"
                    value={form.pokemonName}
                    onChange={(e) =>
                      handleBasicChange("pokemonName", e.target.value)
                    }
                    placeholder="Aizard"
                    aria-describedby={errors.pokemonName ? "pokemon-name-error" : "pokemon-name-hint"}
                    aria-invalid={!!errors.pokemonName}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <p id="pokemon-name-hint" className="field-hint">
                    First and last letters must match the trainer name.
                  </p>
                  {errors.pokemonName && (
                    <p id="pokemon-name-error" className="text-[0.7rem] font-medium text-rose-300" role="alert">
                      {errors.pokemonName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="field-label">Types (up to two)</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((type) => {
                    const isActive = form.types.includes(type);
                    const style = TYPE_COLORS[type] ?? TYPE_COLORS.Normal;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        aria-pressed={isActive}
                        aria-label={`${isActive ? "Remove" : "Add"} ${type} type`}
                        className={`rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide transition ${
                          isActive
                            ? `${style.bg} ${style.border} ${style.text} shadow-sm shadow-emerald-500/40`
                            : "border-slate-700 bg-slate-900/70 text-slate-300 hover:border-emerald-500/60 hover:text-emerald-200"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="field-label">Species</label>
                  <select
                    value={form.species}
                    onChange={(e) =>
                      handleBasicChange("species", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {SPECIES_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="field-label">Ability</label>
                  <select
                    value={form.ability}
                    onChange={(e) =>
                      handleBasicChange("ability", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {ABILITY_GROUPS.map((group) => (
                      <optgroup
                        key={group.label}
                        label={`${group.icon} ${group.label}`}
                      >
                        {group.abilities.map((ability) => (
                          <option key={ability.code} value={ability.code}>
                            {`${ability.name} — ${ability.description}`}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <p className="field-hint">
                    Choose the ability that best reflects how you work.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats editor */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                    Base Stats
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Distribute up to 600 points across your six signature traits.
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-semibold text-slate-200">
                    Remaining:{" "}
                    <span
                      className={
                        remainingPoints === 0
                          ? "text-emerald-300"
                          : remainingPoints < 0
                          ? "text-rose-300"
                          : "text-amber-200"
                      }
                    >
                      {remainingPoints}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {STAT_DEFS.map((stat) => {
                  const value = stats[stat.key];
                  const pct = (value / 255) * 100;
                  const sliderBg = `linear-gradient(to right, rgba(16,185,129,0.9) 0%, rgba(16,185,129,0.9) ${pct}%, rgba(15,23,42,1) ${pct}%, rgba(15,23,42,1) 100%)`;
                  return (
                    <div
                      key={stat.key}
                      className="grid gap-3 rounded-xl border border-slate-800/80 bg-slate-900/70 p-3 md:grid-cols-[minmax(0,_1.4fr)_minmax(0,_1.6fr)] md:items-center"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                          {stat.label}
                        </p>
                        <p className="text-[0.7rem] text-slate-500">
                          {stat.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-full bg-slate-800 px-2 py-1 text-[0.7rem] font-mono text-slate-200">
                          {value}
                        </span>
                        <input
                          type="range"
                          min={1}
                          max={255}
                          value={value}
                          onChange={(e) =>
                            handleStatChange(stat.key, Number(e.target.value))
                          }
                          style={{ backgroundImage: sliderBg }}
                          className="h-2.5 w-full cursor-pointer appearance-none rounded-full border border-slate-800 bg-slate-800 accent-emerald-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pokédex Entry */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                Pokédex Entry
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Generate a prompt to create your Pokédex entry or write your own.
              </p>

              <div className="mt-4 space-y-3">
                <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="field-label">Pokédex Entry Prompt</label>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(pokedexPrompt);
                        } catch (error) {
                          console.error("Failed to copy to clipboard:", error);
                          // Fallback: select text for manual copy
                          const textArea = document.createElement("textarea");
                          textArea.value = pokedexPrompt;
                          textArea.style.position = "fixed";
                          textArea.style.opacity = "0";
                          document.body.appendChild(textArea);
                          textArea.select();
                          try {
                            document.execCommand("copy");
                          } catch (fallbackError) {
                            console.error("Fallback copy failed:", fallbackError);
                          }
                          document.body.removeChild(textArea);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/70 bg-emerald-600/10 px-2.5 py-1 text-[0.7rem] font-medium text-emerald-100 shadow-sm shadow-emerald-500/30 transition hover:bg-emerald-500/20"
                    >
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[0.65rem] text-slate-400 mb-2">
                    Copy this prompt and paste it into Gemini to generate your Pokédex entry.
                  </p>
                  <p className="text-[0.7rem] leading-relaxed text-slate-300">
                    {pokedexPrompt}
                  </p>
                </div>

                <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
                  <label className="field-label">Pokédex Entry</label>
                  <textarea
                    value={form.pokedexEntry}
                    onChange={(e) =>
                      handleBasicChange("pokedexEntry", e.target.value)
                    }
                    placeholder={POKEDEX_PLACEHOLDER}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <p className="field-hint">
                    Paste the generated Pokédex entry from Gemini here.
                  </p>
                </div>
              </div>
            </div>

            {/* Pokemon Image Section */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                Pokémon Image
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Generate an image prompt or upload your own artwork.
              </p>

              <div className="mt-4 space-y-3">
                <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="field-label">Image Generation Prompt</label>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(imagePrompt);
                        } catch (error) {
                          console.error("Failed to copy to clipboard:", error);
                          // Fallback: select text for manual copy
                          const textArea = document.createElement("textarea");
                          textArea.value = imagePrompt;
                          textArea.style.position = "fixed";
                          textArea.style.opacity = "0";
                          document.body.appendChild(textArea);
                          textArea.select();
                          try {
                            document.execCommand("copy");
                          } catch (fallbackError) {
                            console.error("Fallback copy failed:", fallbackError);
                          }
                          document.body.removeChild(textArea);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/70 bg-emerald-600/10 px-2.5 py-1 text-[0.7rem] font-medium text-emerald-100 shadow-sm shadow-emerald-500/30 transition hover:bg-emerald-500/20"
                    >
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[0.65rem] text-slate-400 mb-2">
                    Copy this prompt and paste it into Gemini to generate your Pokémon image.
                  </p>
                  <p className="text-[0.7rem] leading-relaxed text-slate-300">
                    {imagePrompt}
                  </p>
                </div>

                <div className="space-y-2 rounded-xl border border-dashed border-slate-700/80 bg-slate-900/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="field-label">Upload Image</p>
                      <p className="field-hint">
                        Upload your Pokémon&apos;s image to use as the art for this
                        profile and in your exported JSON.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-600/10 px-3 py-1.5 text-xs font-medium text-emerald-100 shadow-sm shadow-emerald-500/30 transition hover:bg-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <span>Choose image…</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {form.imageBase64 && (
                      <span className="text-[0.7rem] text-emerald-200">
                        Image attached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Card preview */}
          <div className="space-y-4">
              <div className="card-surface relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-400 opacity-80 blur-3xl" />
              <div className="relative grid gap-4 p-4 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] md:p-6">
                {/* Left column: Image and Base Stats */}
                <div className="space-y-4">
                  {/* Pokémon Image */}
                  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 shadow-lg shadow-slate-900/80">
                    <div className="relative w-full pb-[100%]">
                      {form.imageBase64 ? (
                        <img
                          src={form.imageBase64}
                          alt={`${form.pokemonName || "Pokémon"} portrait`}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[0.7rem] text-slate-500">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Base Stats Panel */}
                  <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 md:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                        Base Stats
                      </p>
                    </div>

                    <div className="space-y-2">
                      {(() => {
                        const values = Object.values(stats) as number[];
                        const maxValue = Math.max(...values, 1);
                        return STAT_DEFS.map((stat) => {
                          const value = stats[stat.key];
                          const ratio = value / maxValue;
                          const barColor =
                            ratio > 0.75
                              ? "from-emerald-400 via-emerald-500 to-emerald-300"
                              : ratio > 0.5
                              ? "from-sky-400 via-sky-500 to-emerald-300"
                              : ratio > 0.25
                              ? "from-amber-400 via-amber-500 to-amber-300"
                              : "from-rose-400 via-rose-500 to-amber-300";

                          return (
                            <div
                              key={stat.key}
                              className="grid grid-cols-[minmax(0,_1.8fr)_72px_minmax(0,_1.2fr)] items-center gap-3 text-[0.7rem]"
                            >
                              <span className="font-semibold uppercase tracking-wide text-slate-300">
                                {stat.label}
                              </span>
                              <span className="text-right font-mono text-xs text-slate-200">
                                {value}
                              </span>
                              <div className="relative h-2 overflow-hidden rounded-full bg-slate-900/80">
                                <div
                                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${barColor} shadow-[0_0_12px_rgba(16,185,129,0.65)]`}
                                  style={{
                                    width: `${Math.max(ratio * 100, 5)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        });
                      })()}
                      <div className="grid grid-cols-[minmax(0,_1.8fr)_72px_minmax(0,_1.2fr)] items-center gap-3 text-[0.7rem]">
                        <span className="font-semibold uppercase tracking-wide text-slate-300">
                          Total
                        </span>
                        <span className="text-right font-mono text-xs text-emerald-300">
                          {totalStats}
                        </span>
                        <span />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column: Trainer name, Pokémon name, types, species, ability, Pokédex entry */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-100 ring-1 ring-emerald-500/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    PokéProfile
                  </div>

                  {/* Trainer Name */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {form.trainerName || "Trainer Name"}
                    </p>
                  </div>

                  {/* Pokémon Name */}
                  <div className="space-y-1">
                    <p className="text-xl font-black tracking-tight text-slate-50">
                      {form.pokemonName || "Pokémon Name"}
                    </p>
                  </div>

                  {/* Pokémon Types */}
                  <div className="flex flex-wrap items-center gap-2">
                    {form.types.length ? (
                      form.types.map((type) => {
                        const style = TYPE_COLORS[type] ?? TYPE_COLORS.Normal;
                        return (
                          <span
                            key={type}
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${style.bg} ${style.border} ${style.text}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-950/30" />
                            {type}
                          </span>
                        );
                      })
                    ) : (
                      <span className="pill border-slate-700 bg-slate-900/80 text-slate-300">
                        Add at least one type
                      </span>
                    )}
                  </div>

                  {/* Pokémon Species */}
                  <div className="space-y-1">
                    <p className="text-[0.8rem] text-slate-400">
                      {form.species || "Pokémon Species"}
                    </p>
                  </div>

                  {/* Ability */}
                  <div className="space-y-1.5">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-300">
                      Ability
                    </p>
                    <div className="pill border-slate-700 bg-slate-900/80 text-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      {selectedAbility ? (
                        <span className="font-semibold">
                          {selectedAbility.group.icon} {selectedAbility.ability.name}
                        </span>
                      ) : (
                        <span className="font-semibold">Select an ability</span>
                      )}
                    </div>
                    {selectedAbility && (
                      <p className="text-[0.7rem] text-slate-400">
                        {selectedAbility.ability.description}
                      </p>
                    )}
                  </div>

                  {/* Pokédex Entry */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                      Pokédex entry
                    </p>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-200">
                      {form.pokedexEntry || POKEDEX_PLACEHOLDER}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download / Upload JSON */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Download / Upload JSON
                </p>
                <p className="text-[0.7rem] text-slate-400">
                  Download your profile as a JSON file or upload one to load it back.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex min-w-[9rem] items-center justify-center gap-2 rounded-full border border-emerald-500/80 bg-emerald-500/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
                >
                  <span>Download JSON</span>
                </button>
                <label className="inline-flex min-w-[9rem] cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500/80 bg-slate-950 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-200 shadow-sm shadow-slate-900/40 transition hover:bg-slate-900 hover:text-emerald-100">
                  <span>Upload JSON…</span>
                  <input
                    type="file"
                    accept="application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-800 py-6 text-center">
          <p className="text-xs text-slate-400">
            Created by{" "}
            <a
              href="https://github.com/sspathare97"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sagar Pathare
            </a>
            {" · "}
            <a
              href="https://github.com/sspathare97/pokeprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View on GitHub
            </a>
            {" · "}
            <a
              href="https://github.com/sspathare97/pokeprofile/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              MIT License
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;

