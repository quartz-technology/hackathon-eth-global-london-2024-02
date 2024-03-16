const colors: string[] = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-orange-500",
    "bg-emerald-500",
    "bg-gray-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-sky-500",
    "bg-cyan-600",
    "bg-teal-600",
    "bg-blue-600",
    "bg-purple-600",
    "bg-violet-600",
    "bg-fuchsia-600",
    "bg-pink-600",
    "bg-rose-600",
    "bg-orange-600",
    "bg-lime-600",
    "bg-amber-600",
    "bg-yellow-600",
    // Add more colors as needed
  ];
  
  
export function getIdBasedColor(id: string): string {
    // Use the id to generate a seed for randomness
    let seed = 0;
    for (let i = 0; i < id.length; i++) {
      seed += id.charCodeAt(i);
    }
  
    // Use the seed to choose a color
    const randomIndex = seed % colors.length;
    return colors[randomIndex];
  }