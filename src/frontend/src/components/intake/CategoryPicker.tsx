import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'network', name: 'Network / Wi-Fi', icon: 'network', position: { x: 0, y: 0 } },
  { id: 'vpn', name: 'VPN Connection', icon: 'vpn', position: { x: 1, y: 0 } },
  { id: 'email', name: 'Email Issues', icon: 'email', position: { x: 2, y: 0 } },
  { id: 'printer', name: 'Printer Problems', icon: 'printer', position: { x: 0, y: 1 } },
  { id: 'performance', name: 'Slow Computer', icon: 'performance', position: { x: 1, y: 1 } },
  { id: 'account', name: 'Account / Password', icon: 'account', position: { x: 2, y: 1 } },
];

interface CategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
}

export default function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {CATEGORIES.map((category) => {
        const isSelected = value === category.id;
        const iconSize = 170;
        const spriteX = category.position.x * iconSize;
        const spriteY = category.position.y * iconSize;

        return (
          <Card
            key={category.id}
            className={cn(
              'p-4 cursor-pointer transition-all hover:shadow-md',
              isSelected && 'ring-2 ring-primary bg-accent'
            )}
            onClick={() => onChange(category.id)}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="w-16 h-16 bg-contain bg-no-repeat"
                style={{
                  backgroundImage: 'url(/assets/generated/category-icons-sprite.dim_1024x1024.png)',
                  backgroundPosition: `-${spriteX}px -${spriteY}px`,
                  backgroundSize: '512px 512px',
                }}
              />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
