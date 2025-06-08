import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { AlertDisplay } from "@/components/Alert/Alert"

type InputFieldProps = {
    text: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | null;
  }

export const InputField: React.FC<InputFieldProps> = ({ text, type, placeholder, value, onChange, error }) => {
    return (
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor={text}>{text}</Label>
        <Input className="w-full" type={type} id={text} placeholder={placeholder} value={value} onChange={onChange} />
        {error && <AlertDisplay title={error} />}
      </div>
    )
  }
  