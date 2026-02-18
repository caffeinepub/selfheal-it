import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const SYMPTOMS_BY_CATEGORY: Record<string, string[]> = {
  network: [
    'Cannot connect to Wi-Fi',
    'Connected but no internet access',
    'Intermittent connection drops',
    'Slow network speed',
  ],
  vpn: ['VPN won\'t connect', 'VPN disconnects frequently', 'Cannot access company resources', 'VPN is very slow'],
  email: [
    'Cannot send emails',
    'Cannot receive emails',
    'Email client won\'t open',
    'Forgot email password',
  ],
  printer: [
    'Printer not found',
    'Print jobs stuck in queue',
    'Poor print quality',
    'Printer offline',
  ],
  performance: [
    'Computer is very slow',
    'Programs freeze frequently',
    'High CPU usage',
    'Not enough disk space',
  ],
  account: [
    'Forgot password',
    'Account locked',
    'Cannot login',
    'Need to reset MFA',
  ],
};

interface SymptomQuestionnaireProps {
  category: string;
  value: string[];
  onChange: (symptoms: string[]) => void;
}

export default function SymptomQuestionnaire({ category, value, onChange }: SymptomQuestionnaireProps) {
  const symptoms = SYMPTOMS_BY_CATEGORY[category] || [];

  const handleToggle = (symptom: string) => {
    if (value.includes(symptom)) {
      onChange(value.filter((s) => s !== symptom));
    } else {
      onChange([...value, symptom]);
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <p className="text-sm font-medium mb-2">Select all symptoms that apply:</p>
      {symptoms.map((symptom) => (
        <div key={symptom} className="flex items-center space-x-2">
          <Checkbox
            id={symptom}
            checked={value.includes(symptom)}
            onCheckedChange={() => handleToggle(symptom)}
          />
          <Label htmlFor={symptom} className="text-sm font-normal cursor-pointer">
            {symptom}
          </Label>
        </div>
      ))}
    </div>
  );
}
