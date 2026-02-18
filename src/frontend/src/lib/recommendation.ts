import { RUNBOOK_CATALOG } from './runbooks/catalog';

export function recommendRunbook(category: string, symptoms: string[]): string {
  const categoryRunbooks = RUNBOOK_CATALOG.filter((rb) => rb.category === category);

  if (categoryRunbooks.length === 0) {
    return RUNBOOK_CATALOG[0].id;
  }

  let bestMatch = categoryRunbooks[0];
  let bestScore = 0;

  for (const runbook of categoryRunbooks) {
    let score = 0;
    for (const symptom of symptoms) {
      if (runbook.symptoms.some((s) => s.toLowerCase().includes(symptom.toLowerCase()))) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = runbook;
    }
  }

  return bestMatch.id;
}
